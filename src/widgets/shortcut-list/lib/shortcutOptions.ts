import { SVG_PATHS } from "@/shared/constants/assets-path";
import { URL_PATHS } from "@/shared/constants/url-path";

export const shortcutOptions = [
  {
    name: "주변 유치원",
    iconName: SVG_PATHS.SHORTCUT.KINDERGARTEN.LIST,
    link: URL_PATHS.KINDERGARTEN,
  },
  {
    name: "유치원찾기",
    iconName: SVG_PATHS.SHORTCUT.KINDERGARTEN.SEARCH,
    link: URL_PATHS.SEARCH_KINDERGARTEN,
  },
  {
    name: "즐겨찾기",
    iconName: SVG_PATHS.SHORTCUT.BOOKMARK,
    link: URL_PATHS.USER_FAVORITES,
  },
  // TODO: 유치원 지도 페이지 추가
  // {
  //   name: "유치원맵",
  //   iconName: SVG_PATHS.SHORTCUT.KINDERGARTEN.MAP,
  //   link: URL_PATHS.KINDERGARTEN_MAP,
  // }
  {
    name: "리뷰 관리",
    iconName: SVG_PATHS.SHORTCUT.USER.MY_POST,
    link: URL_PATHS.USER_POST,
  },
  {
    name: "예비교사 커뮤니티",
    iconName: SVG_PATHS.SHORTCUT.COMMUNITY.PRE_TEACHER,
    link: URL_PATHS.COMMUNITY_STUDENT,
  },
  {
    name: "교사 커뮤니티",
    iconName: SVG_PATHS.SHORTCUT.COMMUNITY.TEACHER,
    link: URL_PATHS.COMMUNITY_TEACHER,
  },
  {
    name: "교사 게시글 작성",
    iconName: SVG_PATHS.SHORTCUT.COMMUNITY.POST_CREATE,
    link: URL_PATHS.COMMUNITY_POST_EDITOR,
  },
  {
    name: "1:1 문의",
    iconName: SVG_PATHS.SHORTCUT.INQUIRY,
    link: URL_PATHS.INQUIRY_EDITOR,
  },
  {
    name: "문의내역",
    iconName: SVG_PATHS.SHORTCUT.USER.MY_INQUIRY,
    link: URL_PATHS.INQUIRY_MY,
  },
];
