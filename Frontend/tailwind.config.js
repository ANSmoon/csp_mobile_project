/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            screens: {
                'custom-sm': '340px', // 커스텀 반응형 크기를 정의합니다.
                // 다른 반응형 크기들도 정의할 수 있습니다.
            },
        },
    },
    plugins: [],
}
