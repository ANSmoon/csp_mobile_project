import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPages from './pages/LoginPages'
import MonthReportPages from './pages/MonthReportPages'
import WeekReportPages from './pages/WeekReportPages'
import DayReportPages from './pages/DayReportPages'
import MonthBestMenuDetailPages from './pages/MonthBestMenuDetailPages'
import MonthBiggestDiffDetailPages from './pages/MonthBiggestDiffDetailPages'
import DayBiggestDiffDetailPages from './pages/DayBiggestDiffDetailPages'
import DayBestMenuDetailPages from './pages/DayBestMenuDetailPages'
import WeekBiggestDiffDetailPages from './pages/WeekBiggestDiffDetailPages'
import WeekBestMenuDetailPages from './pages/WeekBestMenuDetailPages'
import WaitingPermissionPages from './pages/WaitingPermissionPages'
import NoPermissionPages from './pages/NoPermissionPages'
import RequireAuth from './component/common/RequireAuth'
import ScrollToTop from './component/common/ScrollToTop'

import { Navigate } from 'react-router-dom'
import AdminPages from './pages/AdminPages'
import SettingPages from './pages/SettingPages'
import EditUserInfoPages from './pages/EditUserInfoPages'
import ApplyPages from './pages/ApplyPages'
import RegisterUserInfoPages from './pages/RegisterUserInfoPages'
import RequireAuthAdmin from './component/common/RequireAuthAdmin'
import RequireLoginPages from './pages/RequireLoginPages.jsx'

function App() {
    return (
        <>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    {/* 관리자 로그인 후 접근 가능 */}
                    <Route element={<RequireAuthAdmin />}>
                        <Route path="/admin/*" element={<AdminPages />} />
                    </Route>

                    <Route
                        path="/no-permission"
                        element={<NoPermissionPages />}
                    />
                    <Route
                        path="/waiting-permission"
                        element={<WaitingPermissionPages />}
                    />

                    {/* 로그인 페이지 */}
                    <Route path="/login" element={<LoginPages />} />
                    <Route
                        path="/require-login"
                        element={<RequireLoginPages />}
                    />
                    {/* 로그인 && EXPIRED */}

                    {/* 로그인 후 접근가능 */}
                    <Route element={<RequireAuth />}>
                        <Route path="/day" element={<DayReportPages />} />
                        <Route path="/month" element={<MonthReportPages />} />
                        <Route path="/week" element={<WeekReportPages />} />
                        <Route path="/" element={<Navigate to="/day" />} />
                        <Route
                            path="/month/bestmenu-detail"
                            element={<MonthBestMenuDetailPages />}
                        />
                        <Route
                            path="/month/biggestdiff-detail"
                            element={<MonthBiggestDiffDetailPages />}
                        />
                        <Route
                            path="/week/bestmenu-detail"
                            element={<WeekBestMenuDetailPages />}
                        />
                        <Route
                            path="/week/biggestdiff-detail"
                            element={<WeekBiggestDiffDetailPages />}
                        />
                        <Route
                            path="/day/bestmenu-detail"
                            element={<DayBestMenuDetailPages />}
                        />
                        <Route
                            path="/day/biggestdiff-detail"
                            element={<DayBiggestDiffDetailPages />}
                        />
                    </Route>
                    <Route path="/setting" element={<SettingPages />} />
                    <Route
                        path="/setting/edit-userinfo"
                        element={<EditUserInfoPages />}
                    />
                    <Route
                        path="/register"
                        element={<RegisterUserInfoPages />}
                    />
                    <Route path="/setting/apply" element={<ApplyPages />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
