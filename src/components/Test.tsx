import React, { useState } from "react";
import { Button } from "@heroui/react";
import { CaptchaDialog } from "@/components/common/CaptchaDialog";

const Test = () => {
  const [captchaVisible, setCaptchaVisible] = useState(false);

  const handleBeforeSendCode = () => {
    // 显示行为验证码弹窗
    setCaptchaVisible(true);
  };

  /** 验证成功后继续发送验证码逻辑 */
  const handleCaptchaSuccess = (res:any) => {
    console.log("行为验证通过:", res);
    setCaptchaVisible(false);

    // 调用发送验证码接口（示例）
    // fetch("/api/sendCode", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ validToken: res.data.validToken }),
    // })
    //   .then((r) => r.json())
    //   .then((data) => console.log("验证码发送成功:", data))
    //   .catch(console.error);
    console.log("继续发送验证码的逻辑...");
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>注册页面</h2>

      <Button color="primary" onPress={handleBeforeSendCode}>
        获取验证码（需行为验证）
      </Button>

      {/* 行为验证码组件 */}
      <CaptchaDialog
        visible={captchaVisible}
        onSuccess={handleCaptchaSuccess}
        onClose={() => setCaptchaVisible(false)}
      />
    </div>
  );
}

export default Test