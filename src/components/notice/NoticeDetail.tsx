import NoticeItem from "@/components/notice/NoticeItem";
import { useNotices } from "@/hooks/useNotice";

export default function NoticeDetail({ id }: { id: number }) {
  const { data: notices } = useNotices();
  const notice = notices?.data.find((notice) => notice.id === id);

  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }
  return (
    <div className="flex flex-col gap-5">
      <NoticeItem notice={notice} fontSize="md" />
      <div className="whitespace-pre-wrap py-5 text-xs text-primary-dark01">
        {notice.content}
      </div>
      <div className="flex flex-col gap-1 text-xs text-primary-dark01">
        <p>📧 이메일: onebyone.kindergarten.management@gmail.com</p>
      </div>
    </div>
  );
}
