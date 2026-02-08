// src/data/blogPosts.js
import blogFull1 from "../assets/content-img/blog_full1.jpg";
import blogFull2 from "../assets/content-img/blog_full2.jpg";
import blogFull3 from "../assets/content-img/blog_full3.jpg";

const fullParagraph1 =
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structure.";

const fullParagraph2 =
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";

export const blogPosts = [
  {
    id: "more-than-20-years-1",
    title: "More than 20 years of night club",
    meta: "BY: Admin / 3 Comments / 16 Nov 2018",
    img: blogFull1,
    paragraphs: [fullParagraph1, fullParagraph2],
    commentsCount: 3,
  },
  {
    id: "more-than-20-years-2",
    title: "More than 20 years of night club",
    meta: "BY: Admin / 3 Comments / 16 Nov 2018",
    img: blogFull2,
    paragraphs: [fullParagraph1, fullParagraph2],
    commentsCount: 3,
  },
  {
    id: "more-than-20-years-3",
    title: "More than 20 years of night club",
    meta: "BY: Admin / 3 Comments / 16 Nov 2018",
    img: blogFull3,
    paragraphs: [fullParagraph1, fullParagraph2],
    commentsCount: 3,
  },
];
