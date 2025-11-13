import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem
} from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
} from "@/components/icons";
import { AiFillZhihuSquare } from "react-icons/ai";

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  /** 页面加载时检测登录状态 */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    setIsLogin(!!(token && refreshToken));
  }, []);

  /** 退出登录 */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <HeroUINavbar
      className="border-b border-gray-100 dark:border-gray-800"
      maxWidth="xl"
      position="sticky"
    >
      {/* 左侧 Logo + 导航 */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" draggable={false} />
            <p className="font-bold text-inherit">Dawn</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "transition-colors",
                    {
                      "text-primary font-bold": isActive,
                      "hover:text-primary": !isActive,
                    }
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            );
          })}
        </div>
      </NavbarContent>

      {/* 右侧图标 + 登录状态切换 */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="ZhiHu">
            <AiFillZhihuSquare className="text-default-500" size={24} />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        {/* ✅ 登录状态判断区域 */}
        <NavbarItem className="hidden md:flex">
          {isLogin ? (
            <>
              {/* 控制台 */}
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "transition-colors"
                )}
                color="foreground"
                href="/dashboard"
              >
                控制台
              </Link>

              {/* 我的（下拉菜单） */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button variant="light" className="mx-3">
                    我的
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="个人中心菜单" className="min-w-[140px]">
                  <DropdownItem key="profile">
                    <Link
                      href="/profile"
                      className="text-default-700 hover:text-primary"
                    >
                      个人资料
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="settings">
                    <Link
                      href="/settings"
                      className="text-default-700 hover:text-primary"
                    >
                      设置
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-danger"
                    color="danger"
                    onClick={handleLogout}
                  >
                    退出登录
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              {/* 登录 */}
              <Link
                href="/login"
                className={clsx(
                  "text-sm px-3 py-2 rounded-md transition-colors",
                  {
                    "text-primary font-bold bg-default-100":
                      pathname === "/login",
                    "text-default-600 hover:text-primary":
                      pathname !== "/login",
                  }
                )}
              >
                登录
              </Link>

              {/* 注册 */}
              <Link
                href="/register"
                className={clsx(
                  "text-sm px-3 py-2 rounded-md transition-colors",
                  {
                    "text-primary font-bold bg-default-100":
                      pathname === "/register",
                    "text-default-600 hover:text-primary":
                      pathname !== "/register",
                  }
                )}
              >
                注册
              </Link>
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* 移动端菜单 */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

export default Navbar