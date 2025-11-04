import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useLocation } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
} from "@/components/icons";
import { AiFillZhihuSquare } from "react-icons/ai";

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <HeroUINavbar
      className="border-b border-gray-100 dark:border-gray-800"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-6 w-6"
              draggable={false}
            />
            <p className="font-bold text-inherit">Dawn</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href; // 当前路径是否匹配

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

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter} title="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <AiFillZhihuSquare className="text-default-500" size={24} />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {/* 登录按钮样式修改处 ✅ */}
        <NavbarItem className="hidden md:flex">
          <Link
            href="/login"
            className={clsx(
              "text-sm px-3 py-2 rounded-md transition-colors",
              {
                "text-primary font-bold bg-default-100": pathname === "/login", // 当前页面加粗+高亮
                "text-default-600 hover:text-primary": pathname !== "/login",   // 普通状态
              }
            )}
          >
            登录
          </Link>
          <Link
            href="/register"
            className={clsx(
              "text-sm px-3 py-2 rounded-md transition-colors",
              {
                "text-primary font-bold bg-default-100": pathname === "/register", // 当前页面加粗+高亮
                "text-default-600 hover:text-primary": pathname !== "/register",   // 普通状态
              }
            )}
          >
            注册
          </Link>
        </NavbarItem>
      </NavbarContent>

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
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}

export default Navbar