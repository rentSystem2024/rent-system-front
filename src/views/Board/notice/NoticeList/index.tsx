import React, { ChangeEvent, useState } from 'react'
import './style.css'
import { useUserStore } from 'src/stores';
import { ADMIN_NOTICE_REGIST_ABSOLUTE_PATH, COUNT_PER_PAGE, COUNT_PER_SECTION, MAIN_PATH, NOTICE_DETAIL_ABSOLUTE_PATH } from 'src/constant';
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import { getSearcNoticeListRequest } from 'src/apis/notice/dto';
import { GetSearchNoticeBoardListResponseDto } from 'src/apis/notice/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { noticeListItem } from 'src/types';

function ListItem ({
    registNumber,
    title,
    writeDatetime,
    viewCount
}:noticeListItem) {
    
    const navigator = useNavigate();

    const onClickHandler = () => navigator(NOTICE_DETAIL_ABSOLUTE_PATH(registNumber));

    return (
        <div className='table-list-table-tr' onClick={onClickHandler}>
            <div className='table-list-table-th notice'>
                <div className='notice-list-table-reception-number'>{registNumber}</div>
                <div className='notice-list-table-title' style={{ textAlign: 'left' }}>{title}</div>
                <div className='notice-list-table-write-date'>{writeDatetime}</div>
                <div className='notice-list-table-viewcount'>{viewCount}</div>
            </div>
        </div>
    );
}

export default function NoticeList() {
    
    const {loginUserRole} = useUserStore();
    const navigator = useNavigate();
    const [cookies] = useCookies();

    const [noticeList, setNoticeList] = useState<noticeListItem[]>([]);
    const [viewList, setViewList] = useState<noticeListItem[]>([]);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [totalLenght, setTotalLength] = useState<number>(0);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [searchWord, setSearchWord] = useState<string>('');

    const changePage = (noticeList: noticeListItem[], totalLenght: number) => {
        if (!currentPage) return;
        const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
        let endIndex = currentPage * COUNT_PER_PAGE;
        if (endIndex > totalLenght - 1) endIndex = totalLenght;
        const viewList = noticeList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    const changeSection = (totalPage: number) => {
        if (!currentPage) return;
        const startPage = (currentSection * COUNT_PER_SECTION) - (COUNT_PER_SECTION - 1);
        let endPage = currentSection * COUNT_PER_SECTION;
        if (endPage > totalPage) endPage = totalPage;
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page++) pageList.push(page);
        setPageList(pageList);
    };

    const changeBoardList = (noticeList: noticeListItem[]) => {

        const totalLenght = noticeList.length;
        setTotalLength(totalLenght);

        const totalPage = Math.floor((totalLenght - 1) / COUNT_PER_PAGE) + 1;
        setTotalPage(totalPage);

        const totalSection = Math.floor((totalPage - 1) / COUNT_PER_SECTION) + 1;
        setTotalSection(totalSection);

        changePage(noticeList, totalLenght);

        changeSection(totalPage);
    };


    const getSearchBoardListResponse = (result: GetSearchNoticeBoardListResponseDto | ResponseDto | null) => {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '검색어를 입력하세요.' : 
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(MAIN_PATH);
            return;
        }

        const { noticeList } = result as GetSearchNoticeBoardListResponseDto;
        changeBoardList(noticeList);

        setCurrentPage(!noticeList.length ? 0 : 1);
        setCurrentSection(!noticeList.length ? 0 : 1);
    };


    const onWriteButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_ADMIN') return; 
        navigator(ADMIN_NOTICE_REGIST_ABSOLUTE_PATH);
    };

    const onPreSectionClickHandler = () => {
        if (currentSection <= 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * COUNT_PER_SECTION);
    };

    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    };

    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * COUNT_PER_SECTION + 1);
    };

    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const searchWord = event.target.value;
        setSearchWord(searchWord);
    };

    const onSearchButtonClickHandler = () => {
        if (!searchWord) {
            getSearcNoticeListRequest('', cookies.accessToken).then(getSearchBoardListResponse);
        } else {
            if (!cookies.accessToken) return;
            getSearcNoticeListRequest(searchWord, cookies.accessToken).then(getSearchBoardListResponse);
        }
    };

    const searchButtonClass = searchWord ? 'search-button' : 'disable-button';

    return (
    <>  
    <div className="title-text">공지사항</div>
        <div id='table-list-wrapper'>
            <div className='table-list-top'>
                <div className='table-list-size-text'>전체 <span className='emphasis'>{totalLenght}건</span> | 페이지 <span className='emphasis'>{currentPage}/{totalPage}</span></div>
                <div className='table-list-top-right'>
                    {loginUserRole === 'ROLE_ADMIN' ? 
                    <div className='primary-button' onClick={onWriteButtonClickHandler}>글쓰기</div> : ''
                    }
                </div>
            </div>

            <div className='table-list-table'>
                <div className='table-list-table-th notice'>
                    <div className='notice-list-table-reception-number'>순번</div>
                    <div className='notice-list-table-title'>제목</div>
                    <div className='notice-list-table-write-date'>작성일</div>
                    <div className='notice-list-table-viewcount'>조회수</div>
                </div>
                {viewList.map(item => <ListItem {...item} />)}
            </div>
            <div className='table-list-bottom'>
                <div style={{ width: '299px' }}></div>
                <div className='table-list-pagenation'>
                    <div className='table-list-page-left' onClick={onPreSectionClickHandler}></div>
                    <div className='table-list-page-box'>
                        {pageList.map(page => 
                        page === currentPage ?
                        <div className='table-list-page-active'>{page}</div> :
                        <div className='table-list-page' onClick={() => onPageClickHandler(page)}>{page}</div>
                        )}
                    </div>
                    <div className='table-list-page-right' onClick={onNextSectionClickHandler}></div>
                </div>
                <div className='table-list-search-box'>
                    <div className='table-list-search-input-box'>
                        <input className='table-list-search-input' placeholder='검색어를 입력하세요.' value={searchWord} onChange={onSearchWordChangeHandler} />
                    </div>
                    <div className={searchButtonClass} onClick={onSearchButtonClickHandler}>검색</div>
                </div>
            </div>
        </div>
    </>
    );
}
