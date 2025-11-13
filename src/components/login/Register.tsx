"use client";

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Checkbox, Link, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";

import { sendCodeAPI, registerAPI } from "@/apis/user";
import { CaptchaDialog } from "@/components/common/CaptchaDialog";

export const Register = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const [countdown, setCountdown] = React.useState(0); // 倒计时
  const [registerType, setRegisterType] = useState<"email" | "phone">("email");
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVisible, setCaptchaVisible] = useState(false); // 控制行为验证码弹窗
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /** 密码显示切换 */
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  /** 提交注册逻辑 */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailOrPhone) {
      toast.error(registerType === "email" ? "请输入邮箱" : "请输入手机号");
      return;
    }
    if (!code) {
      toast.error("请输入验证码");
      return;
    }
    if (!password || !confirmPassword) {
      toast.error("请输入密码并确认");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const payload =
        registerType === "email"
          ? {
              type: "email",
              email: emailOrPhone,
              phone: "",
              code,
              password,
              rePassword: confirmPassword,
            }
          : {
              type: "phone",
              email: "",
              phone: emailOrPhone,
              code,
              password,
              rePassword: confirmPassword,
            };

      const res = await registerAPI({
        type: registerType as "email" | "phone", // ✅ 加上类型断言
        email: registerType === "email" ? emailOrPhone : "",
        phone: registerType === "phone" ? emailOrPhone : "",
        code,
        password,
        rePassword: confirmPassword,
      });

      if (res.code === 0) {
        toast.success("注册成功！正在跳转登录页...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(res.message || "注册失败，请重试");
      }
    } catch (error) {
      console.error(error);
      toast.error("网络异常，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  /** 发送验证码 */
  // const handleSendCode = async () => {
  //   if (countdown > 0) return; // 防止重复点击

  //   if (!emailOrPhone) {
  //     toast.error("请输入邮箱或手机号！");
  //     return;
  //   }

  //   try {
  //     const type = registerType === "email" ? "emailRegister" : "phoneRegister";

  //     const res = await sendCodeAPI(emailOrPhone, type);
  //     if (res.code === 0) {
  //       toast.success(
  //         registerType === "email"
  //           ? "📬 验证码已发送至邮箱"
  //           : "📱 验证码已发送至手机"
  //       );
  //     } else {
  //       toast.error(res.message || "发送失败");

  //       return;
  //     }

  //     // 启动倒计时
  //     setCountdown(60);
  //     timerRef.current = setInterval(() => {
  //       setCountdown((prev) => {
  //         if (prev <= 1) {
  //           if (timerRef.current) clearInterval(timerRef.current);
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   } catch (error) {
  //     toast.error("发送验证码失败，请稍后再试");
  //   }
  // };
   /** 🧠 点击“获取验证码”前先进行行为验证 */
  const handleBeforeSendCode = () => {
    if (countdown > 0) return; // 防止重复点击
    if (!emailOrPhone) {
      toast.error("请输入邮箱或手机号！");
      return;
    }
    setCaptchaVisible(true); // 显示行为验证弹窗
  };

  /** ✅ 行为验证码通过后再发送验证码 */
  const handleCaptchaSuccess = async (res: any) => {
    console.log("行为验证通过:", res);
    setCaptchaVisible(false);

    try {
      const type = registerType === "email" ? "emailRegister" : "phoneRegister";

      // 传递行为验证返回的token到后端（如果后端需要）
      const resData = await sendCodeAPI(emailOrPhone, type, res.data.validToken);
      // const resData = await sendCodeAPI(emailOrPhone, type);

      if (resData.code === 0) {
        toast.success(
          registerType === "email"
            ? "📬 验证码已发送至邮箱"
            : "📱 验证码已发送至手机"
        );
      } else {
        toast.error(resData.message || "发送失败");
        return;
      }

      // 启动倒计时
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("发送验证码失败，请稍后再试");
    }
  };

  /** ✨ 清除定时器 */
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-large flex w-full max-w-sm flex-col gap-2 px-8">
        <p className="pb-2 text-left text-3xl font-semibold">
          注册
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>

        {/* 注册方式切换 */}
        <Tabs
          fullWidth
          aria-label="注册方式"
          selectedKey={registerType}
          variant="underlined"
          onSelectionChange={(key) => {
            setRegisterType(key as "email" | "phone");
            setEmailOrPhone("");
            setCode("");
          }}
        >
          <Tab key="email" title="邮箱注册" />
          <Tab key="phone" title="手机号注册" />
        </Tabs>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          {/*  邮箱注册 */}
          {registerType === "email" && (
            <Input
              isRequired
              label="邮箱"
              labelPlacement="outside"
              name="email"
              placeholder="请输入邮箱"
              type="email"
              variant="bordered"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          )}

          {/* 手机注册 */}
          {registerType === "phone" && (
            <Input
              isRequired
              label="手机号"
              labelPlacement="outside"
              name="phone"
              placeholder="请输入手机号"
              type="tel"
              variant="bordered"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          )}

          {/* 验证码（两种方式共用） */}
          <div className="flex gap-2">
            <Input
              isRequired
              label="验证码"
              labelPlacement="outside"
              name="code"
              placeholder="请输入验证码"
              type="text"
              variant="bordered"
              className="flex-1"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleBeforeSendCode}
              className="h-[40px] mt-6"
              disabled={countdown > 0}
              color={countdown > 0 ? "default" : "primary"}
            >
              {countdown > 0 ? `${countdown}s` : "获取验证码"}
            </Button>
          </div>

          {/* 密码 */}
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="密码"
            labelPlacement="outside"
            name="password"
            placeholder="请输入密码"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 确认密码 */}
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="确认密码"
            labelPlacement="outside"
            name="confirmPassword"
            placeholder="请再次输入密码"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Checkbox isRequired className="py-4" size="sm">
            我同意&nbsp;
            <Link className="relative z-1" href="#" size="sm">
              用户协议
            </Link>
            &nbsp;和&nbsp;
            <Link className="relative z-1" href="#" size="sm">
              隐私政策
            </Link>
          </Checkbox>

          <Button color="primary" type="submit">
            注册
          </Button>
        </form>
        <p className="text-small text-center">
          <Link href="/login" size="sm">
            已有账号? 去登录
          </Link>
        </p>
      </div>
      {/* ✨ 行为验证码弹窗 */}
      <CaptchaDialog
        visible={captchaVisible}
        onSuccess={handleCaptchaSuccess}
        onClose={() => setCaptchaVisible(false)}
      />
    </div>
  );
}
