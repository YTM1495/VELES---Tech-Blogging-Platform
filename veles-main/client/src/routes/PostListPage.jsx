import { useState } from "react";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";

const PostListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-[#E5E9E4] font-[Philosopher]">Blogs</h1>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-green-800 hover:bg-green-900 dark:bg-[#7BC98C] dark:hover:bg-[#68b87a] dark:text-[#111713] text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden transition-colors font-medium shadow-sm"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse items-stretch gap-8 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} w-full shrink-0 md:block md:w-72`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
