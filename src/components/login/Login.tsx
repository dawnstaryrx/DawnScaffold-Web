"use client";

import React, {useState} from "react";
import {Button, Input, Checkbox, Link, Form, Divider} from "@heroui/react";
import {Icon} from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { loginByPasswordAPI, useGitHubLogin, useLinuxDoLogin } from "@/apis/user"; // 引入前面写的API
import { toast } from "react-hot-toast";

export const Login = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { loginWithGitHub } = useGitHubLogin();
  const { loginWithLinuxDo } = useLinuxDoLogin();

  /** 登录提交 */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      setErrorMsg("请输入用户名和密码");
      toast.error("请输入用户名和密码");
      return;
    }

    try {
      setLoading(true);
      const res = await loginByPasswordAPI({ username, password });
      console.log("登录返回：", res);
      if (res.code === 0 && res.data) {
        // 保存token
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
        // 跳转首页
        toast.success("登录成功，正在跳转首页...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setErrorMsg(res.message || "登录失败，请检查账号或密码");
        toast.error("登录失败，请检查账号或密码");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("网络异常，请稍后再试");
      toast.error("网络异常，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-large flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
        <p className="pb-2 text-left text-3xl font-semibold">
          登录
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
        <Form className="flex flex-col gap-2" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="用户名/邮箱/手机"
            labelPlacement="outside"
            name="username"
            placeholder="请输入用户名/邮箱/手机"
            type="text"
            variant="bordered"
          />
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
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox defaultSelected name="remember" size="sm">
              记住我
            </Checkbox>
            <Link className="text-default-500" href="/reset" size="sm">
              忘记密码?
            </Link>
          </div>
          <Button className="w-full" color="primary" type="submit" isLoading={loading}>
            登录
          </Button>
        </Form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="text-tiny text-default-500 shrink-0">或</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            // TODO  startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            onClick={loginWithLinuxDo}
          >
            使用 LinuxDo 登录
          </Button>
          <Button
            variant="bordered"
            startContent={<Icon icon="fe:github" width={24} />}
            onClick={loginWithGitHub}
          >
            使用 GitHub 登录
          </Button>
        </div>
        <p className="text-small text-center">
          需要创建账户?&nbsp;
          <Link href="/register" size="sm">
            去注册
          </Link>
        </p>
      </div>
    </div>
  );
}
