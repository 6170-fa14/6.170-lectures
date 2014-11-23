(* Now we switch to a single-page app. *)

(* To keep this demo simple, we'll do authentication via a cookie value that we trust.
 * That is, misbehaving users are free to claim to be anyone, and we won't complain. *)
cookie user : string

(* Helper function to require being logged in, returning username *)
fun loggedIn () =
    loggedInAs <- getCookie user;
    case loggedInAs of
        None => error <xml>Not logged in</xml>
      | Some usr => return usr

(* Here's an SQL table definition. *)
table message : { User : string,
                  (* Who posted the message? *)
                  When : time,
                  (* At what time? *)
                  Text : string
                  (* With what content? *) }

table follow : { Followed : string,
                 Follower : string }

table hashtag : { Tag : string,
                  User : string,
                  When : time }
(* Here the last two fields are references to [message]. *)

fun main () =
    loggedInAs <- getCookie user;

    (* First, allocate a data source to store latest messages by followed users. *)
    msgs <- listMessages ();
    latest_messages <- source msgs;

    (* Next, allocate a data source for the list of followed users. *)
    followed <- getFollowed ();
    latest_followed <- source followed;

    (* Finally, some sources for text entered into textboxes. *)
    to_follow <- source "";
    to_post <- source "";

    return <xml>
      <head>
        <title>Fritter</title>
      </head>

      <body>
        <h1>Fritter</h1>

        {case loggedInAs of
             None => <xml><form>
               Log in: <textbox{#User}/> <submit action={login}/>
             </form></xml>
           | Some _ => <xml>
             <p><a link={logout ()}>[Logout]</a></p>

             <hr/>

             <h2>Following</h2>

             (* Here we use the reactive programming features, to get a piece
              * of HTML that will update automatically as its data dependencies change. *)
             <table>
               <dyn signal={followed <- signal latest_followed;
                            return (List.mapX (fn usr => <xml><tr>
                              <td>{[usr]}</td>
                              <td><button onclick={fn _ =>
                                                      rpc (unfollow usr);
                                                      set latest_followed (List.filter (fn usr' => usr' <> usr) followed)}>[unfollow]</button></td>
                            </tr></xml>) followed)}/>
             </table>

             <form>
               Start following: <ctextbox source={to_follow}/>
               <button onclick={fn _ =>
                                   tf <- get to_follow;
                                   rpc (startFollowing tf);
                                   followed <- get latest_followed;
                                   set latest_followed (List.sort (fn x y => x > y) (tf :: followed))}>Start</button>
             </form>

             <form>
               Post message: <ctextbox source={to_post}/>
               <button onclick={fn _ =>
                                   tp <- get to_post;
                                   rpc (post tp)}>Post</button>
             </form>
           </xml>}

        <hr/>

        <table>
          <tr><th>User</th> <th/> <th>When</th></tr>
          <dyn signal={msgs <- signal latest_messages;
                       return (List.mapX (fn r => <xml><tr>
                         <td><b>{[r.User]}</b></td>
                         <td>{[r.Text]}</td>
                         <td>{[r.When]}</td>
                       </tr></xml>) msgs)}/>
        </table>
      </body>
    </xml>

and login r =
    setCookie user {Value = r.User,
                    Secure = False,
                    Expires = None};
    main ()

and logout () =
    clearCookie user;
    main ()

and listMessages () =
    loggedInAs <- getCookie user;

    query <- (case loggedInAs of
                  None => return (SELECT *
                                  FROM message
                                  ORDER BY message.When DESC)
                | Some usr => return (SELECT message.*
                                      FROM message, follow
                                      WHERE follow.Follower = {[usr]}
                                        AND follow.Followed = message.User
                                      ORDER BY message.When DESC));

    (* This standard-library function is for returning query results as a list. *)
    queryL1 query

and getFollowed () =
    loggedInAs <- getCookie user;

    case loggedInAs of
        None => return []
      | Some usr => List.mapQuery (SELECT follow.Followed
                                   FROM follow
                                   WHERE follow.Follower = {[usr]}
                                   ORDER BY follow.Followed)
                                  (fn r => r.Follow.Followed)

and post msg =
    usr <- loggedIn ();
    dml (INSERT INTO message(User, When, Text)
         VALUES ({[usr]}, CURRENT_TIMESTAMP, {[msg]}))

and startFollowing to_follow =
    usr <- loggedIn ();
    dml (INSERT INTO follow(Follower, Followed)
         VALUES ({[usr]}, {[to_follow]}))

and unfollow u =
    usr <- loggedIn ();
    dml (DELETE FROM follow
         WHERE Follower = {[usr]}
           AND Followed = {[u]})
