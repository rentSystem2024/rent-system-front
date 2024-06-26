// description: 로그인 Request Body DTO 
export interface SignInRequestDto {
    userId: string;
    userPassword: string;
}

// description: 아이디 중복 확인 Request Body DTO 
export interface IdCheckRequestDto {
    userId: string;
}

// description: 닉네임 중복확인 Request Body DTO 
export interface NickNameCheckRequestDto {
    nickName: string;
}

// description: 이메일 인증 Request Body DTO 
export interface EmailAuthRequestDto {
    userEmail: string;
}

// description: 이메일 인증 확인 Request Body DTO 
export interface EmailAuthCheckRequestDto {
    userEmail: string;
    authNumber: string;
}

// description: 회원가입 Request Body Dto 
export interface SignUpRequestDto {
    userId: string;
    nickName: string;
    userPassword: string;
    userEmail: string;
    authNumber: string;
}

// description: 아이디 찾기 Request Body Dto
export interface FindIdRequestDto {
    userEmail: string;
}

// description: 비밀번호 찾기 Request Body Dto
export interface FindPasswordRequestDto {
    userId: string;
    userEmail: string;
}

// description: 비밀번호 재설정 Request Body Dto
export interface FindPasswordResetRequestDto {
    userPassword: string;
}