// Logo
import LogoSvg from '@/assets/logo.svg';

// 图片资源路径配置
export const ASSETS = {
  images: {
    logo: LogoSvg,
    avatars: {
      default: '/images/avatars/default.png'
    }
  }
} as const;

// 类型定义
export type AssetsConfig = typeof ASSETS;
export type ImageAssets = AssetsConfig['images'];

// 辅助函数
export function getImagePath(path: keyof ImageAssets): string {
  return ASSETS.images[path] as string;
}

// 导出默认配置
export default ASSETS; 