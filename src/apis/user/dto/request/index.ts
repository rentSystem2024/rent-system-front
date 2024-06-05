import ResponseDto from "src/apis/response.dto";


// description: 이메일 인증 Request Body DTO 
export interface EmailAuthRequestDto {
    userEmail: string;
}

// description: 내정보 패스워드 수정 Request Body Dto 
export interface PutMyInfoPwRequestDto {
    userPassword: string;
}

// description: 내정보 이메일 수정 Request Body Dto 
export interface PutMyInfoEmailRequestDto {
    userEmail: string;
    authNumber: string;
}