"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export const Register = () => {
  const [tacLoaded, setTacLoaded] = useState(false);

  /** 动态加载 Tianai Captcha SDK */
  const loadTACScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.initTAC) {
        setTacLoaded(true);
        resolve();
        return;
      }

      // 创建 script 标签
      const script = document.createElement("script");
      script.src = "/tac/js/tac.min.js"; // 你放在 public/tac 下的路径
      script.onload = () => {
        setTacLoaded(true);
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);

      // 同时加载样式
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/tac/css/tac.css";
      document.head.appendChild(link);
    });
  };

  /** 点击按钮时拉起行为验证码 */
  const handleShowCaptcha = async () => {
    try {
      // 确保 SDK 已加载
      if (!tacLoaded) await loadTACScript();

      const config = {
        // 后端生成接口
        requestCaptchaDataUrl: "/api/captcha/gen",
        // 后端校验接口
        validCaptchaUrl: "/api/captcha/check",
        // 绑定的div容器
        bindEl: "#captcha-box",
        // 验证成功
        validSuccess: (res, c, tac) => {
          console.log("✅ 验证成功:", res);
          tac.destroyWindow();
          // TODO: 在这里继续登录逻辑，如 login(res.data.validToken)
        },
        // 验证失败
        validFail: (res, c, tac) => {
          console.warn("❌ 验证失败:", res);
          tac.reloadCaptcha();
        },
        btnRefreshFun: (el, tac) => {
          console.log("🔄 刷新验证码");
          tac.reloadCaptcha();
        },
        btnCloseFun: (el, tac) => {
          console.log("❎ 关闭验证码");
          tac.destroyWindow();
        },
      };

      // 样式配置，可选
      const style = {
        logoUrl: null, // 去掉logo
      };

      // 初始化验证码
      window
        .initTAC("/tac", config, style)
        .then((tac) => tac.init())
        .catch((e) => console.error("初始化TAC失败:", e));
    } catch (error) {
      console.error("加载验证码失败:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>注册页面</h2>

      <Button color="primary" onPress={handleShowCaptcha}>
        点击验证行为
      </Button>

      {/* 验证码容器 */}
      <div id="captcha-box" style={{ marginTop: "30px" }}></div>
    </div>
  );
};
