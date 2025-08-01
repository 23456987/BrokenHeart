import axios from 'axios';

const BASE_URL = 'https://brokenheart.in/wp-json/brokenheart-api/v1';

// Fetch all posts
export const fetchPosts = async () => {
  const res = await axios.get(`${BASE_URL}/get-posts/`);
  return res.data;
};

// Fetch single post by ID
export const fetchPostById = async (id) => {
  const res = await axios.get(`${BASE_URL}/get-posts/?id=${id}`);
  console.log("res",res.data);
  return res.data;
};
