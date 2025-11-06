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
