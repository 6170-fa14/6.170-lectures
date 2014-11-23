(* To keep this demo simple, we'll do authentication via a cookie value that we trust.
 * That is, misbehaving users are free to claim to be anyone, and we won't complain. *)
cookie user : string

(* Here's an SQL table definition. *)
table message : { User : string,
                  (* Who posted the message? *)
                  When : time,
                  (* At what time? *)
                  Text : string
                  (* With what content? *) }

fun main () =
    loggedInAs <- getCookie user;

    (* [queryX1] is a library function for running a query over 1 table,
     * generates an HTML fragment for each result row,
     * concatenating the fragments together to form the return value. *)
    allMessages <- queryX1 (SELECT *
                            FROM message
                            ORDER BY message.When)
                   (fn r => <xml><tr>
                     <td><b>{[r.User]}</b></td>
                     <td>{[r.Text]}</td>
                     <td>{[r.When]}</td>
                   </tr></xml>);

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

             <form>
               Post message: <textbox{#Text}/> <submit action={post}/>
             </form>
           </xml>

           }

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
    loggedInAs <- getCookie user;
    case loggedInAs of
        None => error <xml>Not logged in</xml>
      | Some usr =>
        dml (INSERT INTO message(User, When, Text)
             VALUES ({[usr]}, CURRENT_TIMESTAMP, {[r.Text]}));
        main ()
