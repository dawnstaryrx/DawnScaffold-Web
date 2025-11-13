"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function GitHubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const savedState = localStorage.getItem("oauth_state");

      if (!code || !state || state !== savedState) {
        toast.error("GitHub 登录失败：状态不匹配");
        navigate("/login");
        return;
      }

      try {
        // 调用后端接口换取系统登录token
        const res = await axios.post(`/api/login/github`, { code });
        if (res.data.code === 0 && res.data.data) {
          const { token, refreshToken, userInfo } = res.data.data;
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          toast.success("GitHub 登录成功");
          navigate("/");
        } else {
          toast.error(res.data.message || "GitHub 登录失败");
        }
      } catch (err) {
        toast.error("GitHub 登录异常，请稍后重试");
      } finally {
        localStorage.removeItem("oauth_state");
      }
    };

    handleGitHubCallback();
  }, []);

  return <p className="text-center text-default-500 mt-10">GitHub 登录中，请稍候...</p>;
}
