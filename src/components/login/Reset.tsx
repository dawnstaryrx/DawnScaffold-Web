import React, { useRef, useState } from "react";
import { Button, Input, Checkbox, Link, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";

import { sendCodeAPI } from "@/apis/user";

const Reset = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const [countdown, setCountdown] = React.useState(0); // 倒计时
  const [registerType, setRegisterType] = useState<"email" | "phone">("email");
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerType === "email") {
      // 📬 邮箱重置密码逻辑
      console.log("邮箱重置");
    } else {
      // 📱 手机重置密码逻辑
      console.log("手机重置");
    }
  };

  /** 📨 发送验证码 */
  const handleSendCode = async () => {
    if (countdown > 0) return; // 防止重复点击

    if (!emailOrPhone) {
      toast.error("请输入邮箱或手机号！");
      return;
    }

    try {
      const type = registerType === "email" ? "emailReset" : "phoneReset";

      const res = await sendCodeAPI(emailOrPhone, type);
      if (res.code === 0) {
        toast.success(
          registerType === "email"
            ? "📬 验证码已发送至邮箱"
            : "📱 验证码已发送至手机"
        );
      } else {
        toast.error(res.message || "发送失败");

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
          重置密码
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>

        {/* 注册方式切换 */}
        <Tabs
          fullWidth
          aria-label="重置方式"
          selectedKey={registerType}
          variant="underlined"
          onSelectionChange={(key) =>
            setRegisterType(key as "email" | "phone")
          }
        >
          <Tab key="email" title="邮箱" />
          <Tab key="phone" title="手机号" />
        </Tabs>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          {/*  邮箱重置 */}
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
            />
            <Button
              type="button"
              onClick={handleSendCode}
              className="h-[40px] mt-6"
              disabled={countdown > 0}
              color={countdown > 0 ? "default" : "primary"}
            >
              {countdown > 0 ? `${countdown}s` : "获取验证码"}
            </Button>
          </div>

          {/* 新密码 */}
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
            label="新密码"
            labelPlacement="outside"
            name="password"
            placeholder="请输入密码"
            type={isVisible ? "text" : "password"}
            variant="bordered"
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
          />

          <Button color="primary" type="submit">
            确认
          </Button>
        </form>
        <p className="text-small text-center">
          <Link href="/login" size="sm">
            去登录
          </Link>
          <Link href="/register" size="sm">
            &nbsp; 去注册
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Reset