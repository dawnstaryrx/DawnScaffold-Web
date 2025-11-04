import { useEffect, useState } from "react";

const FooterSimple = () => {
  const [footerHtml, setFooterHtml] = useState<string>("");

  useEffect(() => {
    // 模拟后端返回的数据（实际开发中应改成接口请求）
    const fetchFooter = async () => {
      // 假设从后端拿到的HTML如下：
      const htmlFromServer = `CopyRight © 2025 <a href="https://dongfangjibai.com" target="_blank" class="text-blue-600">智浪星辰</a>`;

      setFooterHtml(htmlFromServer);
    };

    fetchFooter();
  }, []);

  return (
    <div>
      <footer className="
    h-16 w-full flex items-center justify-center
    bg-gray-100 text-default-600
    dark:bg-black dark:text-gray-400
    transition-colors duration-300
  ">
        {/* 用 dangerouslySetInnerHTML 渲染后端传来的 HTML */}
        <span
          className="text-default-600"
          dangerouslySetInnerHTML={{ __html: footerHtml }}
        />
      </footer>
    </div>
  );
};

export default FooterSimple;
