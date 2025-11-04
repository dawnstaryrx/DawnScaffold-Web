"use client";

import React from "react";
import {Button, Input, Checkbox, Link, Form, Divider} from "@heroui/react";
import {Icon} from "@iconify/react";

export const Login = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
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
            name="email"
            placeholder="请输入用户名/邮箱/手机"
            type="email"
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
          <Button className="w-full" color="primary" type="submit">
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
          >
            使用 LinuxDo 登录
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
          >
            使用 Github 登录
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
