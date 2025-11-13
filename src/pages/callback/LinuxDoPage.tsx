"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function LinuxDoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLinuxDoCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const savedState = localStorage.getItem("oauth_state");
      const tokenRequested = sessionStorage.getItem("linuxdoTokenRequested");


      if (!code || !state || state !== savedState) {
        toast.error("LinuxDo 登录失败：状态不匹配");
        navigate("/login");
        return;
      }

      if (tokenRequested) {
        // 已经请求过 token，避免重复调用
        console.log("⚠️ LinuxDo token 已请求过，跳过重复请求");
        return;
      }

      try {
        sessionStorage.setItem("linuxdoTokenRequested", "true");
        // 调用后端接口，用 code 换取系统 token
        console.log("🎯 LinuxDo 回调开始，请求后端接口...");
        const res = await axios.post(`/api/login/linuxdo`, { code });
        console.log("✅ 收到响应：", res);
        if (res.data.code === 0 && res.data.data) {
          const { token, refreshToken, userInfo } = res.data.data;

          // 存储 token 和用户信息
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));

          toast.success("LinuxDo 登录成功");
          navigate("/");

          // 清理 URL 中的 code 和 state，防止刷新重复请求
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          url.searchParams.delete("state");
          window.history.replaceState(null, "", url.toString());
        } else {
          toast.error(res.data.message || "LinuxDo 登录失败");
        }
      } catch (error) {
        console.error("LinuxDo 登录异常：", error);
        toast.error("LinuxDo 登录异常，请稍后重试");
      } finally {
        // 清除 state，防止重复验证
        localStorage.removeItem("oauth_state");
        sessionStorage.removeItem("linuxdoTokenRequested"); // 清理标记
      }
    };

    handleLinuxDoCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-600">
      <h1 className="text-2xl font-semibold mb-2">正在处理您的请求，请稍候...</h1>
      <p>LinuxDo 登录中，请稍候片刻。</p>
    </div>
  );
}
