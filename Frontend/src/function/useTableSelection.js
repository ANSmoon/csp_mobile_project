import { useState, useEffect } from 'react'

export function useTableSelection(initialState = [], data) {
    const [selectedRows, setSelectedRows] = useState(initialState)

    const toggleRowSelection = (rowId) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter((id) => id !== rowId))
        } else {
            setSelectedRows([...selectedRows, rowId])
        }
    }

    const handleRowClick = (rowId) => {
        toggleRowSelection(rowId)
    }

    // 선택된 행만 필터링하여 출력
    const selectedData = data.filter((_, index) => selectedRows.includes(index))
    useEffect(() => {
        console.log('⭐⭐⭐⭐selectedData: ', selectedData)
    }, [selectedData])

    // 전체 선택
    const [selectAll, setSelectAll] = useState(false) // 전체 선택 체크박스의 상태
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]) // 모든 행 선택 해제
        } else {
            const allRowIds = data.map((_, index) => index) // 모든 행의 인덱스 배열
            setSelectedRows(allRowIds) // 모든 행 선택
        }
        setSelectAll(!selectAll) // 전체 선택 체크박스 상태 토글
    }

    return {
        selectedRows,
        selectAll,
        selectedData,
        toggleRowSelection,
        handleRowClick,
        toggleSelectAll,
    }
}
