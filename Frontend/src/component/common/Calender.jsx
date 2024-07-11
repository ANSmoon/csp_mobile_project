/* 

Calendar Component

날짜를 선택하는 창을 부드러운 애니메이션 효과와 함께 띄웁니다.
props:
    array
    isOpen
    closeModal
    openModal


*/

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import CalendarIcon from '../../assets/calendar.svg'
import CalenderContents from './CalenderContents'

export default function Calender({ array, isOpen, closeModal, openModal }) {
    return (
        <>
            <div className="relative p-3">
                <button type="button" onClick={openModal}>
                    <img src={CalendarIcon} alt="CalendarIcon" />
                </button>
            </div>

            <Transition
                appear
                show={isOpen}
                as={Fragment}
                className="fixed inset-0 overflow-y-auto"
            >
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all h-[500px]">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-bold leading-6 text-gray-900 p-2 flex justify-between items-end mb-4"
                                    >
                                        날짜 선택하기
                                        <button
                                            type="button"
                                            className="float-right text-gray-300 "
                                            onClick={closeModal}
                                        >
                                            ✕
                                        </button>
                                    </Dialog.Title>
                                    <CalenderContents
                                        closeModal={closeModal}
                                        array={array}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
