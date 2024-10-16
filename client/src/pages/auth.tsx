import AuthForm from "@/components/auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


function AuthPage() {
    const onLoginSubmit = (values: any) => {
        console.log("Login form submitted")
        console.log(values)
    }

    const onRegisterSubmit = (values: any) => {
        console.log("Register form submitted")
        console.log(values)
    }

    return (
        <div className="w-full h-screen grid place-items-center border px-2">
            <Card className="w-full max-w-[30rem]">
                <CardHeader>
                    <CardTitle>Edit Wars</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-10">
                        <TabsTrigger className="h-8" value="login">Login</TabsTrigger>
                        <TabsTrigger className="h-8" value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <AuthForm
                            onSubmit={(values) => onLoginSubmit(values)} 
                            title="Welcome back!"
                            submitText="Login"
                        />
                    </TabsContent>
                    <TabsContent value="register">
                        <AuthForm 
                            onSubmit={(values) => onRegisterSubmit(values)} 
                            title="Create an account"
                            submitText="Register"
                        />
                    </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center text-gray-500">© 2024 Edit Wars</p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AuthPage;