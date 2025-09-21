import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "홍길동",
      content: "첫 번째 테스트 글입니다 🌱",
      image: null,
      createdAt: new Date(),
    },
  ]);

  const addPost = (post) => {
    setPosts((prev) => [
      { id: Date.now(), createdAt: new Date(), ...post },
      ...prev,
    ]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => useContext(PostContext);
