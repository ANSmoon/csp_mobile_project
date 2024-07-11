/* 

Button Component
props : text, color, type, onclick, link

- 사용법
<Button color="black" text="button1"/>
<Button color="gray" text="button2"/>
<Button color="detail" text="button" link="path이름"/>


*/

import { Link } from 'react-router-dom'
import rightArrow from '../../assets/right.svg'

const Button = (props) => {
    if (props.color === 'black') {
        // backgroud black, text white button
        return (
            <Link
                type={props.type}
                onClick={props.onclick}
                className="inline bg-gray-900 text-white text-center active:bg-gray-700 px-4 py-2 rounded-3xl"
            >
                {props.text}
            </Link>
        )
    } else if (props.color === 'gray') {
        // backround gray, text black button
        return (
            <Link
                type={props.type}
                onClick={props.onclick}
                className="inline bg-neutral-200 text-center active:bg-gray-200 px-4 py-2 rounded-3xl"
            >
                {props.text}
            </Link>
        )
    } else if (props.color === 'detail') {
        // 자세히보기 > button
        return (
            <Link to={props.link}>
                <button
                    onClick={props.onclick}
                    className="inline border border-neutral-200 text-center active:bg-gray-200 px-4 py-2 rounded-3xl"
                >
                    <span className="flex">
                        <span className="pr-2 text-neutral-500">
                            자세히보기
                        </span>
                        <img src={rightArrow} alt="right-arrow" />
                    </span>
                </button>
            </Link>
        )
    }
}

export default Button
