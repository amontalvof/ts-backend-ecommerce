export default `
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>New password request</title>
    </head>
    <body>
        <div
            style="
                width: 100%;
                background: #eeeeee;
                position: relative;
                font-family: sans-serif;
                padding-bottom: 40px;
            "
        >
            <center>
                <img
                    style="padding: 20px; width: 10%"
                    src="https://res.cloudinary.com/a03m02f92/image/upload/v1641354908/ecommerce/plantilla/logo_wq3nhv.png"
                />
            </center>
            <div
                style="
                    position: relative;
                    margin: auto;
                    width: 600px;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #999999;
                "
            >
                <center>
                    <img
                        style="padding: 20px; width: 15%"
                        src="https://res.cloudinary.com/a03m02f92/image/upload/v1647979341/ecommerce/plantilla/icon_pass_zp5wxd.png"
                    />

                    <h3 style="font-weight: 100; color: #999999">
                        NEW PASSWORD REQUEST
                    </h3>

                    <hr style="border: 1px solid #cccccc; width: 80%" />

                    <h4
                        style="
                            font-weight: 100;
                            color: #999999;
                            padding: 0 20px;
                        "
                    >
                        <strong>Your new password: </strong>{{newPassword}}
                    </h4>

                    <a
                        href="{{confirmLink}}"
                        target="_blank"
                        style="text-decoration: none"
                    >
                        <div
                            style="
                                line-height: 60px;
                                background: {{buttonBackground}};
                                width: 60%;
                                color: {{buttonColor}};
                            "
                        >
                            Login again
                        </div>
                    </a>

                    <br />
                </center>
            </div>
        </div>
    </body>
</html>
`;
