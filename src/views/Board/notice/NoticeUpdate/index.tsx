import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useUserStore } from 'src/stores/car.reservation.store';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';

import ResponseDto from 'src/apis/response.dto';
import { NOTICE_DETAIL_ABSOLUTE_PATH, NOTICE_LIST_ABSOLUTE_PATH } from 'src/constant';
import { GetNoticeBoardListResponseDto, GetNoticeBoardResponseDto } from 'src/apis/notice/dto/response';
import { getNoticeRequest, putNoticeRequest } from 'src/apis/notice';
import { PutNoticeBoardRequestDto } from 'src/apis/notice/dto/request';
import { uploadFile } from 'src/apis/imageUrl';

//                    component                    //
export default function NoticeUpdate() {

    //                      state                      //
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const { registNumber } = useParams();
    const { loginUserId, loginUserRole } = useUserStore();

    const [cookies] = useCookies();

    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);

    //                    function                    //
    const navigator = useNavigate();

    const getNoticeResponse = (result: GetNoticeBoardListResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '올바르지 않은 접수 번호입니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            navigator(NOTICE_LIST_ABSOLUTE_PATH);
            return;
        }

        const { title, writerId, contents, imageUrl } = result as GetNoticeBoardResponseDto;
        if (writerId !== loginUserId) {
            alert('권한이 없습니다.');
            navigator(NOTICE_LIST_ABSOLUTE_PATH);
            return;
        }

        setTitle(title);
        setContents(contents);
        setImageUrl(imageUrl);
        setInitialImageUrl(imageUrl);
    };

    const putNoticeResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'VF' ? '모든 값을 입력해주세요.' :
            result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
            result.code === 'WC' ? '이미 답글이 작성되어있습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        if (!registNumber) return;
        navigator(NOTICE_DETAIL_ABSOLUTE_PATH(registNumber));
    };

    //                event handler                    //
    const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const onContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const contents = event.target.value;
        if (contents.length > 1000) return;
        setContents(contents);

        if (!contentsRef.current) return;
        contentsRef.current.style.height = 'auto';
        contentsRef.current.style.height = `${contentsRef.current.scrollHeight}px`;
    };

    const onUpdateButtonClickHandler = async () => {
        if (!cookies.accessToken || !registNumber) return;
        if (!title.trim() || !contents.trim()) return;

        let imageUrlToUpdate = imageUrl;
        if (selectedFile) {
            imageUrlToUpdate = await uploadFile(selectedFile);
        } else {
            imageUrlToUpdate = initialImageUrl;
        }

        const requestBody: PutNoticeBoardRequestDto = {
            title,
            contents,
            imageUrl: imageUrlToUpdate
        };
        putNoticeRequest(registNumber, requestBody, cookies.accessToken).then(putNoticeResponse);
    };

    const onFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImageUrl(imageUrl);
        }
    };

    //                    effect                       //
    useEffect(() => {
        if (!registNumber || !cookies.accessToken) return;
        if (!loginUserRole) return;
        if (loginUserRole !== 'ROLE_ADMIN') {
            navigator(NOTICE_LIST_ABSOLUTE_PATH);
            return;
        }
        getNoticeRequest(registNumber).then(getNoticeResponse);
    }, [loginUserRole, registNumber, cookies.accessToken, navigator]);

    //                    Render                       //
    return (
        <div id="qna-write-wrapper">
            <div className='qna-write-top'>
                <div className='qna-write-title-box'>
                    <input
                        className='qna-write-title-input'
                        placeholder='제목을 입력해 주세요'
                        value={title}
                        onChange={onTitleChangeHandler}
                    />
                </div>
                <div className='primary-button' onClick={onUpdateButtonClickHandler}>
                    올리기
                </div>
            </div>
            <div className='qna-write-contents-box'>
                <textarea
                    ref={contentsRef}
                    className='qna-write-contents-textarea'
                    rows={10}
                    placeholder='내용을 입력해주세요 / 1000자'
                    maxLength={1000}
                    value={contents}
                    onChange={onContentsChangeHandler}
                />
                <div style={{ border: '1px solid rgba(238, 238, 238, 1)' }}></div>
                <div className='file-select'>
                    파일첨부
                    <input type="file" onChange={onFileChangeHandler} />
                </div>
                {imageUrl && (
                    <div className='file-upload'>
                        <img src={imageUrl} alt="Preview" className='file-image' />
                    </div>
                )}
            </div>
        </div>
    );
}