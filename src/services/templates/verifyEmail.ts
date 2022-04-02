export default `
<html lang='en'>
    <head>
        <meta charset='UTF-8' />
        <title>Verify Email</title>
    </head>
    <body>
        <div
            style='
                width: 100%;
                background: #eeeeee;
                position: relative;
                font-family: sans-serif;
                padding-bottom: 40px;
            '
        >
            <center>
                <img
                    style='padding: 20px; width: 10%'
                    src='https://res.cloudinary.com/a03m02f92/image/upload/v1641354908/ecommerce/plantilla/logo_wq3nhv.png'
                />
            </center>
            <div
                style='
                    position: relative;
                    margin: auto;
                    width: 600px;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #999999;
                '
            >
                <center>
                    <img
                        style='padding: 20px; width: 15%'
                        src='https://res.cloudinary.com/a03m02f92/image/upload/v1647978937/ecommerce/plantilla/icon_email_cn5wxq.png'
                    />

                    <h3 style='font-weight: 100; color: #999999'>
                        VERIFY YOUR EMAIL ADDRESS
                    </h3>

                    <hr style='border: 1px solid #cccccc; width: 80%' />

                    <h4
                        style='
                            font-weight: 100;
                            color: #999999;
                            padding: 0 20px;
                        '
                    >
                        To start using your Full E-commerce account, you must
                        confirm your email address
                    </h4>

                    <a
                        href={{confirmLink}}
                        target='_blank'
                        style='text-decoration: none'
                    >
                        <div
                            style='
                                line-height: 60px;
                                background: {{buttonBackground}};
                                width: 60%;
                                color: {{buttonColor}};
                            '
                        >
                            Click here to verify your email address
                        </div>
                    </a>

                    <br />

                    <hr style='border: 1px solid #cccccc; width: 80%' />

                    <h5 style='font-weight: 100; color: #999999'>
                        If you have not signed up for this account, you can
                        ignore this email and the account will be deleted.
                    </h5>
                </center>
            </div>
        </div>
    </body>
</html>`;
