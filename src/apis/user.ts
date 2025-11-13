import request from "./index";

/** 接口返回通用结构 */
export interface Result<T = any> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 发送验证码（邮箱或手机）
 * @param emailOrPhone 邮箱或手机号
 * @param type 类型：emailLogin, phoneLogin, emailRegister, phoneRegister
 */
export const sendCodeAPI = (
  emailOrPhone: string,
  type: string,
  token: string
): Promise<Result> => {
  return request.post("/sendCode", null, {
    params: { emailOrPhone, type, token },
  });
};

/**
 * 用户注册
 * @param data 注册参数
 */
export const registerAPI = (data: {
  type: "email" | "phone";
  email?: string;
  phone?: string;
  code: string;
  password: string;
  rePassword: string;
}): Promise<Result> => {
  return request.post("/register", data);
};

/**
 * 用户名或邮箱 + 密码登录
 * @param data 登录参数
 */
export const loginByPasswordAPI = (data: {
  username: string; // 用户名或邮箱
  password: string; // 密码
}): Promise<
  Result<{
    token: string;
    refreshToken: string;
    userInfo: {
      id: number;
      username: string;
      email?: string;
      avatar?: string;
      roles?: string[];
    };
  }>
> => {
  return request.post("/login/password", data);
};

export const useGitHubLogin = () => {
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;
  const GITHUB_AUTHORIZATION_ENDPOINT = import.meta.env.VITE_GITHUB_AUTHORIZATION_ENDPOINT;

  /** 生成随机字符串，用于防止CSRF攻击 */
  const generateRandomString = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  /** 发起GitHub登录 */
  const loginWithGitHub = () => {
    console.log("开始 GitHub 登录流程");
    const state = generateRandomString(16);
    localStorage.setItem("oauth_state", state);

    const authUrl = `${GITHUB_AUTHORIZATION_ENDPOINT}?scope=user:email&client_id=${encodeURIComponent(
      GITHUB_CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&state=${state}`;
    console.log("跳转到 GitHub 授权页：", authUrl);
    // 跳转 GitHub 授权页
    window.location.href = authUrl;
  };

  return { loginWithGitHub };
};

// src/hooks/useLinuxDoLogin.ts
export const useLinuxDoLogin = () => {
  const LINUXDO_CLIENT_ID = import.meta.env.VITE_LINUXDO_CLIENT_ID;
  const LINUXDO_REDIRECT_URI = import.meta.env.VITE_LINUXDO_REDIRECT_URI;
  const LINUXDO_AUTHORIZATION_ENDPOINT = import.meta.env.VITE_LINUXDO_AUTHORIZATION_ENDPOINT;

  /** 生成随机字符串，用于防止CSRF攻击 */
  const generateRandomString = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  /** 发起 LinuxDo 登录 */
  const loginWithLinuxDo = () => {
    console.log("开始 LinuxDo 登录流程");
    sessionStorage.removeItem("linuxdoTokenRequested");
    // 1. 生成随机state防CSRF攻击
    const state = generateRandomString(16);
    localStorage.setItem("oauth_state", state);

    // 2. 拼接授权地址
    const authUrl = `${LINUXDO_AUTHORIZATION_ENDPOINT}?response_type=code&client_id=${encodeURIComponent(
      LINUXDO_CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(
      LINUXDO_REDIRECT_URI
    )}&state=${state}`;

    console.log("跳转到 LinuxDo 授权页：", authUrl);

    // 3. 跳转到授权页面
    window.location.href = authUrl;
  };

  return { loginWithLinuxDo };
};
