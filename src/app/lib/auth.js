import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        username: {
          label: "Username",
          type: "username",
          placeholder: "example_user1",
        },
        password: {
          label: "Password",
          type: "password",
        }
      },
      async authorize(credentials) {
        console.log("AUTHORIZES CREDENTIALS", credentials)
        try {
          const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          console.log("A RESPONSE TO TEST", response)

          if (!response.ok) {
            // Handle errors (e.g., invalid credentials)
            throw new Error('Invalid credentials');
          }

          const user = await response.json();
          if (user) {
            console.log("User", user)
            return {
              id: user.user_id,
              email: user.email,
              token: user.access,
            };
          };

          return null;

        } catch (error) {
          // Handle login errors (e.g., invalid credentials)
          console.error("Login error:", error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
};

// export async function loginIsRequiredServer() {
//   const session = await getServerSession(authConfig);
//   if (!session) return redirect("/");
// }

// export function loginIsRequiredClient() {
//   if (typeof window !== "undefined") {
//     const session = useSession();
//     const router = useRouter();
//     if (!session) router.push("/");
//   }
// }