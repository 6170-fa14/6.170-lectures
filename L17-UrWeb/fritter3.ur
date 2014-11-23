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

    (* [queryX1] is a library function for running a query over 1 table,
     * generates an HTML fragment for each result row,
     * concatenating the fragments together to form the return value. *)
    query <- (case loggedInAs of
                  None => return (SELECT *
                                  FROM message
                                  ORDER BY message.When)
                | Some usr => return (SELECT message.*
                                      FROM message, follow
                                      WHERE follow.Follower = {[usr]}
                                        AND follow.Followed = message.User
                                      ORDER BY message.When));
    allMessages <- queryX1 query
                   (fn r => <xml><tr>
                     <td><b>{[r.User]}</b></td>
                     <td>{[r.Text]}</td>
                     <td>{[r.When]}</td>
                   </tr></xml>);

    (* Compute some HTML showing who the current user (if logged in) follows. *)
    following <- (case loggedInAs of
                      None => return <xml/>
                    | Some usr => queryX1 (SELECT follow.Followed
                                           FROM follow
                                           WHERE follow.Follower = {[usr]}
                                           ORDER BY follow.Followed)
                                          (fn r => <xml><tr>
                                            <td>{[r.Followed]}</td>
                                            <td><form><submit action={unfollow r.Followed} value="[unfollow]"/></form></td>
                                          </tr></xml>));

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

             <table>
               {following}
             </table>

             <form>
               Start following: <textbox{#User}/> <submit action={startFollowing}/>
             </form>

             <form>
               Post message: <textbox{#Text}/> <submit action={post}/>
             </form>

             <form>
               Hashtag search: <textbox{#Tag}/> <submit action={tagSearch}/>
             </form>
           </xml>}

        <hr/>

        <table>
          <tr><th>User</th> <th/> <th>When</th></tr>
          {allMessages}
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

and post r =
    usr <- loggedIn ();
    when <- now;
    dml (INSERT INTO message(User, When, Text)
         VALUES ({[usr]}, {[when]}, {[r.Text]}));

    let
        fun addHashtags text =
            case String.split text #" " of
                None => return ()
              | Some (word, rest) =>
                (if String.length word > 0 && String.sub word 0 = #"#" then
                     dml (INSERT INTO hashtag(User, When, Tag)
                          VALUES ({[usr]}, {[when]}, {[word]}))
                 else
                     return ());
                addHashtags rest
    in
        addHashtags r.Text;
        main ()
    end

and startFollowing r =
    usr <- loggedIn ();
    dml (INSERT INTO follow(Follower, Followed)
         VALUES ({[usr]}, {[r.User]}));
    main ()

and unfollow u () =
    usr <- loggedIn ();
    dml (DELETE FROM follow
         WHERE Follower = {[usr]}
           AND Followed = {[u]});
    main ()

and tagSearch r =
    loggedInAs <- getCookie user;

    query <- (case loggedInAs of
                  None => return (SELECT message.*
                                  FROM message, hashtag
                                  WHERE message.User = hashtag.User
                                    AND message.When = hashtag.When
                                    AND hashtag.Tag = {[r.Tag]}
                                  ORDER BY message.When)
                | Some usr => return (SELECT message.*
                                      FROM message, follow, hashtag
                                      WHERE follow.Follower = {[usr]}
                                        AND follow.Followed = message.User
                                        AND message.User = hashtag.User
                                        AND message.When = hashtag.When
                                        AND hashtag.Tag = {[r.Tag]}
                                      ORDER BY message.When));
    allMessages <- queryX1 query
                   (fn r => <xml><tr>
                     <td><b>{[r.User]}</b></td>
                     <td>{[r.Text]}</td>
                     <td>{[r.When]}</td>
                   </tr></xml>);

    return <xml>
      <head>
        <title>Fritter -- hashtag search</title>
      </head>

      <body>
        <h1>Fritter -- hashtag search</h1>

        <a link={main ()}>[back to main]</a>

        <table>
          <tr><th>User</th> <th/> <th>When</th></tr>
          {allMessages}
        </table>
      </body>
    </xml>
