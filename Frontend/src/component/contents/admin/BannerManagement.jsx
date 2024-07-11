import { useState, useEffect, useRef } from 'react'
import { useTableSelection } from '../../../function/useTableSelection'
import {
    useApplyListQuery,
    useApproveMultiUsersMutation,
} from '../../../services/admin/adminApiSlice'
import AdminModal from './AdminModal'
import Spinner from '../../common/Spinner'
import ImageImg from '../../../assets/image.svg'
import {
    useGetBannerQuery,
    useGetUsingBannerQuery,
    usePutBannerMutation,
    usePostBannerMutation,
    useDeleteBannersMutation,
} from '../../../services/banner/bannerApiSlice'
import infoImg from '../../../assets/info.svg'

const BannerManagement = () => {
    // 전체 배너 이미지 목록 받아오기
    const { data, isLoading, error } = useGetBannerQuery()
    // 사용중인 배너 목록 받아오기
    const {
        data: dataUsingBanners,
        isLoadingUsingBanners,
        errorUsingBanners,
    } = useGetUsingBannerQuery()
    // 배너 이미지 파일 업로드 요청
    const [postBanner, { isLoadingPostBanner, errorPostBanner }] =
        usePostBannerMutation()
    // 사용할 배너 설정 요청
    const [putUsingBanner] = usePutBannerMutation()
    // 배너 이미지 삭제
    const [deleteBanners, { isLoadingDeleteBanners, errorDeleteBanners }] =
        useDeleteBannersMutation()

    useEffect(() => {
        console.log('🌕All Banner Image List: ', data, isLoading, error)
    }, [data, isLoading, error])

    useEffect(() => {
        console.log(
            '✔️Using Banner Image List: ',
            dataUsingBanners,
            isLoadingUsingBanners,
            errorUsingBanners,
        )
    }, [dataUsingBanners, isLoadingUsingBanners, errorUsingBanners])

    // 테이블 행 선택 --------------------
    const {
        selectedRows,
        selectAll,
        toggleRowSelection,
        handleRowClick,
        toggleSelectAll,
    } = useTableSelection([], data ? data.banners : [])
    console.log(selectedRows)
    // 모달 -----------------------------------------------------------------------------------------
    const [open, setOpen] = useState(false) // 선택 승인 모달 open 상태
    const [openDelete, setOpenDelete] = useState(false) // 선택 삭제 모달 open 상태
    const [openSelect, setOpenSelect] = useState(false)

    // 저장 하기
    async function handleSave() {
        console.log('저장 하기. 사용할 배너 이미지의 ids', selectedRows)
        // 선택된 row의 item.id
        const responsePutUsingBanner = await putUsingBanner({
            bannerIdList: selectedRows,
        })
        console.log('putUsingBanner', responsePutUsingBanner)
        setOpen(false)
    }

    // 선택 삭제
    async function handleSelectDelete() {
        console.log('선택 삭제')

        try {
            const response = await deleteBanners({
                bannerIdList: selectedRows,
            })
            console.log('Image deleted:', response.data)
        } catch (error) {
            console.error('Error deleting image:', errorDeleteBanners)
        }
        setOpenDelete(false)
    }

    // 이미지 업로드
    const [selectedImage, setSelectedImage] = useState()

    // 이미지 변경
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        // 이미지 파일 선택
        setSelectedImage(file)
    }
    console.log('★★★★★ selectedImages ', selectedImage)
    const handleImageUpload = async (e) => {
        if (selectedImage) {
            const formData = new FormData()
            formData.append('file', selectedImage)

            try {
                // login-id, bannerName, file
                console.log(
                    'postBanner Parameter:',
                    2023100617,
                    selectedImage.name,
                    formData,
                )

                const response = await postBanner({
                    loginId: 2023100617,
                    bannerName: selectedImage.name,
                    file: formData,
                })
                console.log('Image uploaded:', response.data)
            } catch (error) {
                console.error('Error uploading image:', errorPostBanner)
            }
        } else {
            alert('이미지 파일을 선택해주세요.')
        }
    }

    // 배너 이미지 설정 테이블 바디
    const contents = () => {
        if (isLoading || isLoadingUsingBanners) {
            return (
                <tbody>
                    <tr>
                        <Spinner />
                    </tr>
                </tbody>
            )
        } else if (error || errorUsingBanners) {
            return (
                <tbody>
                    <tr></tr>
                </tbody>
            )
        } else if (data) {
            return (
                <tbody className=" text-gray-700">
                    {/* 데이터 */}
                    {data.banners?.map((item, key) => {
                        return (
                            <tr
                                onClick={() => handleRowClick(item.id)}
                                // 이 행이 선택되면 배경색 진하게 변경
                                className={
                                    selectedRows.includes(item.id)
                                        ? 'bg-gray-100'
                                        : ''
                                }
                                key={key}
                            >
                                {/* select */}
                                <td className="py-6 text-center">
                                    <input
                                        id="checked-checkbox"
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() =>
                                            toggleRowSelection(item.id)
                                        }
                                        value=""
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </td>
                                {/* id */}
                                <td className="text-center">{item.id}</td>
                                {/* 배너 이름 */}
                                <td className="text-center">
                                    {item.bannerName}
                                </td>
                                {/* image */}

                                <td className="p-4 text-center flex justify-center items-center ">
                                    {item.image ? (
                                        <img
                                            src={item.image.filePath}
                                            alt={'slide-' + key}
                                            className="bg-gray-100 h-32"
                                        />
                                    ) : (
                                        // empty img
                                        <div className="w-48 h-32 bg-gray-200 flex justify-center">
                                            <img
                                                src={ImageImg}
                                                alt="none-img"
                                                className="w-6 h-auto"
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                        // }
                    })}
                </tbody>
            )
        }
    }

    return (
        <div className="p-4 pt-16">
            {/* 타이틀 */}
            <span className=" text-3xl font-bold">배너 관리</span>
            {/* 저장하기 모달 */}
            <AdminModal
                open={open}
                onClose={() => setOpen(false)}
                onApprove={handleSave}
                color="green"
                title="사용할 배너 선택"
                content="선택한 이미지들의 사용 상태를 변경하시겠습니까? 사용중인 배너는 미사용 상태로 변경되고 미사용중인 배너는 사용 상태로 변경됩니다."
                btnText="변경"
            />

            {/* 선택 삭제 모달 */}
            <AdminModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onApprove={handleSelectDelete}
                color="red"
                title="선택 삭제"
                content="선택한 모든 행의 배너 이미지를
                삭제하시겠습니까? 삭제한 이미지는 복구할 수
                없습니다."
                btnText="삭제"
            />
            {/* 파일 추가 */}
            <div className="flex justify-start mt-12 items-center gap-8">
                <img src={infoImg} className="h-5" alt="info" />
                <span className="text-sm text-neutral-400 text-base text-lg w-44">
                    파일을 추가한 뒤 배너 이미지 목록에서 사용할 배너 이미지를
                    모두 선택한 뒤 저장하기를 눌러 적용해주세요.
                </span>
                <div className="py-6 text-center">
                    {/* 이미지 미리보기 */}
                    {selectedImage ? (
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="max-w-full max-h-32 mb-4"
                        />
                    ) : (
                        // empty img
                        <div className="w-48 h-32 bg-gray-200 flex justify-center">
                            <img
                                src={ImageImg}
                                alt="none-img"
                                className="w-6 h-auto"
                            />
                        </div>
                    )}
                </div>
                <div className="py-6 text-center">
                    <input
                        accept="image/*"
                        type="file"
                        id="file_input"
                        className=""
                        onChange={(e) => handleImageChange(e)}
                    />
                    <label for="file_input">
                        <button
                            onClick={(e) => handleImageUpload(e)}
                            type="button"
                            className="bg-blue-700 text-white text-xs py-2 px-4 rounded-lg mr-2 hover:bg-blue-600 shadow"
                        >
                            파일 추가
                        </button>
                    </label>
                </div>
            </div>
            <div className="flex justify-between mt-12 items-center ">
                {/* 테이블 설명 */}
                <div className="text-gray-500">
                    ✔️총 {data?.length}행, 선택된 행 {selectedRows.length}개
                    <br />
                    ✔️사용중인 배너 ids: [{' '}
                    {dataUsingBanners &&
                        dataUsingBanners.banners.map((item, key) =>
                            key === dataUsingBanners.banners.length - 1
                                ? item.id
                                : item.id + ', ',
                        )}{' '}
                    ] <br />
                    ✏️사용법: 미사용중인 배너를 상태 변경하면 사용 상태로
                    변경됩니다.
                    <br /> 반대로 사용중인 배너를 상태 변경하면 미사용 상태로
                    변경됩니다.
                </div>
                {/* 선택된 행이 없을 때 alert를 띄웁니다. */}
                <div>
                    {/* 버튼 */}
                    <button
                        onClick={() => {
                            if (selectedRows.length >= 1) {
                                setOpen(true)
                            } else {
                                alert('선택된 행이 0개 입니다.')
                            }
                        }}
                        className="bg-blue-700 text-white text-xs py-1.5 w-28 rounded-lg mr-2 hover:bg-blue-600 shadow"
                    >
                        사용 상태 변경
                    </button>
                    <button
                        onClick={() => {
                            if (selectedRows.length >= 1) {
                                setOpenDelete(true)
                            } else {
                                alert('선택된 행이 0개 입니다.')
                            }
                        }}
                        className="border border-1 border-gray-200 text-xs py-1.5  w-28 rounded-lg mr-2 shadow hover:bg-gray-50 "
                    >
                        선택 삭제
                    </button>
                </div>
            </div>

            {/* 사용자 테이블 */}
            <div className="overflow-x-auto mt-4">
                <table className="table-auto w-full mb-12">
                    <thead className="m-4">
                        <tr className="border-b border-neutral-500 text-sm text-neutral-900">
                            {/* checkbox */}
                            <th className="w-20 py-3 font-light">
                                {/* 전체 선택 */}
                                <input
                                    id="checked-checkbox"
                                    type="checkbox"
                                    value=""
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </th>
                            <th className="w-20 py-3 font-light">id</th>
                            <th className="w-20 py-3 font-light">
                                banner_name
                            </th>
                            {/* image */}
                            <th className="px-4 py-3 font-light">
                                slide_image
                            </th>
                        </tr>
                    </thead>
                    {contents()}
                </table>
            </div>
        </div>
    )
}

export default BannerManagement
