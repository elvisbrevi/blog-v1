// Do not merge: a deliberate type error so `tsc -b` fails and Cloudflare Pages
// reports a failed build (blog-editor checks how that check looks on GitHub).
export const broken: number = 'not a number';
