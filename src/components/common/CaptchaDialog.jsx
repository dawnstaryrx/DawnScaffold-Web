"use client";

import { useEffect, useState } from "react";

/**
 * 通用行为验证码组件（基于 Tianai Captcha）
 * props:
 * - onSuccess: 验证成功后的回调 (token 或验证结果)
 * - onFail: 验证失败回调（可选）
 * - visible: 控制是否显示验证窗口
 * - onClose: 验证窗口关闭事件
 */
export const CaptchaDialog = ({ visible, onSuccess, onFail, onClose }) => {
  const [tacLoaded, setTacLoaded] = useState(false);

  /** 动态加载 Tianai Captcha SDK */
  const loadTACScript = () => {
    return new Promise((resolve, reject) => {
      if (window.initTAC) {
        setTacLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "/tac/js/tac.min.js"; // 放在 public/tac 下
      script.onload = () => {
        setTacLoaded(true);
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);

      // 加载样式
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/tac/css/tac.css";
      document.head.appendChild(link);
    });
  };

  /** 初始化验证码 */
  const initCaptcha = async () => {
    if (!visible) return;
    if (!tacLoaded) await loadTACScript();

    const config = {
      requestCaptchaDataUrl: "/api/captcha/gen", // 后端生成接口
      validCaptchaUrl: "/api/captcha/check",     // 校验接口
      bindEl: "#captcha-box",
      validSuccess: (res, c, tac) => {
        console.log("✅ 验证成功:", res);
        tac.destroyWindow();
        onSuccess?.(res);
      },
      validFail: (res, c, tac) => {
        console.warn("❌ 验证失败:", res);
        tac.reloadCaptcha();
        onFail?.(res);
      },
      btnRefreshFun: (el, tac) => tac.reloadCaptcha(),
      btnCloseFun: (el, tac) => {
        tac.destroyWindow();
        onClose?.();
      },
    };

    const style = {
      logoUrl: null, // 不显示 logo
    };

    window
      .initTAC("/tac", config, style)
      .then((tac) => tac.init())
      .catch((e) => console.error("初始化TAC失败:", e));
  };

  useEffect(() => {
    initCaptcha();
  }, [visible]);

  return visible ? <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        id="captcha-box"
        style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 12px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      ></div>
    </div> : null;
};
