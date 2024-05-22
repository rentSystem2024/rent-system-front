import ""
import "./style.css";
import ""

export default function SideContainer() {
    return (
        <div id="wrapper">
            <div className="logo-container">로고</div>
            <div className="top-bar-container">
                <div className="top-bar-button">
                    <div className="board-button">공지사항</div>            
                    <div className="board-button">문의사항</div>
                </div>
                <div className="top-bar-button">
                    <div className="board-button">로그인</div>
                    <div className="board-button">회원가입</div>
                </div>
            </div>
            <div className="main-container">
                <div className="main-container">메인</div>
            </div>
        </div>
    );
}