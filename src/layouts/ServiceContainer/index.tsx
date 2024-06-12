import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import { ADMIN_USER_LIST_ABSOLUTE_PATH, AUTH_SIGN_IN_ABSOLUTE_PATH, AUTH_SIGN_UP_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, NOTICE_LIST_ABSOLUTE_PATH, QNA_LIST_ABSOLUTE_PATH, USER_INFO_ABSOLUTE_PATH } from "src/constant";
import { useUserStore } from "src/stores";
import { useCookies } from "react-cookie";
import { GetMyInfoResponseDto, GetSignInUserResponseDto } from "src/apis/user/dto/response";
import ResponseDto from "src/apis/response.dto";
import { getMyInfoRequest, getSignInUserRequest } from "src/apis/user";

function TopBar() {

    const [nickName, setNickName] = useState<string>('');

    const navigator = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();
    const { pathname } = useLocation();
    const { loginUserRole, setLoginUserId, setLoginUserRole } = useUserStore();

    const getMyInfoResponse = (result: GetMyInfoResponseDto | ResponseDto | null) => {

        if (!result) return;

        const { nickName } = result as GetMyInfoResponseDto;
        setNickName(nickName);

    };
    
    useEffect (() => {
        if (!cookies.accessToken) return;

        getMyInfoRequest(cookies.accessToken).then(getMyInfoResponse);
    }, [cookies.accessToken]);

    // 로그아웃 처리 시 원래 있던 쿠키 값을 제거
    const onLogoutClickHandler = () => {
        removeCookie('accessToken', { path: '/' });
        setLoginUserId('');
        setLoginUserRole('');
        navigator(MAIN_ABSOLUTE_PATH);
    };

    const onLogoClickHandler = () => {
        if(pathname === MAIN_ABSOLUTE_PATH){
            window.location.reload();
        } else {
        navigator(MAIN_ABSOLUTE_PATH);}
    }        
    const onNoticeClickHandler = () => navigator(NOTICE_LIST_ABSOLUTE_PATH);
    const onQnaClickHandler = () => navigator(QNA_LIST_ABSOLUTE_PATH);
    const onSignInClickHandler = () => navigator(AUTH_SIGN_IN_ABSOLUTE_PATH);
    const onSignUpClickHandler = () => navigator(AUTH_SIGN_UP_ABSOLUTE_PATH);
    const onMyPageClickHandler = () => navigator(USER_INFO_ABSOLUTE_PATH);
    const onAdminPageClickHandler = () => navigator(ADMIN_USER_LIST_ABSOLUTE_PATH)

    return (
        <>
        <div className="logo-container" onClick={onLogoClickHandler}>
            <div className="logo-image logo">로고 정해야함</div>
        </div>
        <div className="top-bar-container">
            <div className="top-bar-button">
            <div className="top-button" onClick={onNoticeClickHandler}>공지사항</div>
            <div className="top-button" onClick={onQnaClickHandler}>문의사항</div>
            </div>
            <div className="top-bar-button">
            {loginUserRole === 'ROLE_USER' &&
            <div className="top-bar-role">
                <div className="sign-in-wrapper">
                    <div className="user-mypage-button person"></div>
                    <div className="user-button" onClick={onMyPageClickHandler}>{nickName}님</div>
                </div>
                <div className="logout-button" onClick={onLogoutClickHandler}>로그아웃</div>
                
            </div>
            }
            {loginUserRole === 'ROLE_ADMIN' && 
                <div className="top-bar-role">
                    <div className="sign-in-wrapper">
                        <div className="user-mypage-button person"></div>
                        <div className="user-button" onClick={onAdminPageClickHandler}>관리자님</div>
                    </div>
                    <div className="logout-button" onClick={onLogoutClickHandler}>로그아웃</div>
                </div>
            }
            {loginUserRole !== 'ROLE_USER' && loginUserRole !== 'ROLE_ADMIN' && 
                <div className="top-button" onClick={onSignInClickHandler}>로그인</div>
            }
            {loginUserRole !== 'ROLE_USER' && loginUserRole !== 'ROLE_ADMIN' && 
                <div className="top-button" onClick={onSignUpClickHandler}>회원가입</div>
            }
            </div>
        </div>
        </>
    );
}


function BottomBar() {
    return (
        <div className="bottom-container">
            <div className="bottom-content">
                <div className="company-info">
                    <h3>회사소개</h3>
                    <p>
                        (주)제주렌트카<br/>
                        대표: 김민철,장현아,우하늘,한성윤<br/>
                        경기도 남양주시 오남읍 진건오남로929번길 8<br/>
                        사업자등록번호: 132-81-62165 사업자정보확인<br/>
                        통신판매업신고번호: 2020-진접오남-0219<br/>
                        개인정보보호책임자: 박유신<br/>
                        팩스번호: 031-527-8618<br/>
                        이메일: jakomo@jakomo.co.kr
                    </p>
                </div>
                <div className="quick-links">
                    <h3>빠른 링크</h3>
                    <ul>
                        <li>마이페이지</li>
                        <li>곻지사항</li>
                        <li>이용약관</li>
                        <li>이용안내</li>
                        <li>개인정보처리방침</li>
                        <li>구매관련 문의 사항문의</li>
                    </ul>
                </div>
                <div className="social-media">
                    <h3>고객센터</h3>
                    <p>1588-6007<br/>평일: 09:00 ~ 17:30<br/>점심: 12:00 ~ 13:00<br/>휴무: 주말/공휴일</p>
                </div>
            </div>
            <div className="bottom-footer">
                <p>Copyright 2024. JAKOMO All Rights Reserved.</p>
                <p>입금계좌안내<br/>하나은행 164-910017-44504<br/>예금주: (주)자코모<br/>* 입금 시 주문자 성함 필시 기재</p>
            </div>
        </div>
    );
}

    export default function ServiceContainer() {

    const { setLoginUserId, setLoginUserRole } = useUserStore();
    const navigator = useNavigate();
    const [cookies] = useCookies();
    
    const getSignInUserResponse = (result: GetSignInUserResponseDto | ResponseDto | null) => {
        if (!result) return;
    
        const { userId, userRole } = result as GetSignInUserResponseDto;
        setLoginUserId(userId);
        setLoginUserRole(userRole);
    };

    useEffect(() => {

        if (!cookies.accessToken) {
            return;
        }

        getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);

    }, [cookies.accessToken]);
    
    return (
        <div id="wrapper">
        <TopBar />
        <div className="main-container">
            <Outlet />
        </div>
        <BottomBar/>
        </div>
    );
}
