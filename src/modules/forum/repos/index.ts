
import { MemberRepo } from "./implementations/typeormMemberRepo";
import { PostRepo } from "./implementations/typeormPostRepo";
import { CommentRepo } from "./implementations/typeormCommentRepo";
import { PostVotesRepo } from "./implementations/typeormPostVotesRepo";
import { CommentVotesRepo } from "./implementations/typeormCommentVotesRepo";

const commentVotesRepo = new CommentVotesRepo();
const postVotesRepo = new PostVotesRepo();
const memberRepo = new MemberRepo();
const commentRepo = new CommentRepo(commentVotesRepo);
const postRepo = new PostRepo(commentRepo, postVotesRepo);

export { memberRepo, postRepo, commentRepo, postVotesRepo, commentVotesRepo };
