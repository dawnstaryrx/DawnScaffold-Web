import request from "./index";

/** 通用返回结构 */
export interface Result<T = any> {
  code: number;
  message: string;
  data?: T;
}

/** 生成验证码返回结构（后端 ImageCaptchaVO 对应） */
export interface CaptchaVO {
  id: string;
  type: string;
  backgroundImage: string;
  templateImage: string;
  backgroundImageTag: string;
  templateImageTag: string;
  backgroundImageWidth: number;
  backgroundImageHeight: number;
  templateImageWidth: number;
  templateImageHeight: number;
  data: any;
}

/** 校验验证码提交的数据（后端 CaptchaController.Data 对应） */
export interface CaptchaCheckData {
  id: string;
  data: {
    point: { x: number; y: number }[]; // 滑块轨迹点
    track: any;                        // 轨迹信息（从滑动组件中取）
  };
}

/**
 * 生成行为验证码
 * @returns 验证码数据（包含背景图和滑块图等信息）
 */
export const genCaptchaAPI = (): Promise<Result<CaptchaVO>> => {
  return request.get("/captcha/gen");
};

/**
 * 校验行为验证码
 * @param data 验证数据（id 和滑动轨迹）
 * @returns 校验结果（成功时返回 validToken）
 */
export const checkCaptchaAPI = (
  data: CaptchaCheckData
): Promise<Result<{ validToken: string }>> => {
  return request.post("/captcha/check", data);
};
