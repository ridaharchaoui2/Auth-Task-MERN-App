import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useVerifyEmailMutation } from "@/services/authApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifyEmailScreen = () => {
  const { token } = useParams();
  const [verifyEmail, { isLoading, isSuccess, isError, error }] =
    useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {isLoading ? "Validating your request..." : "Account status update"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 py-8">
          {/* LOADING STATE */}
          {isLoading && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Verifying your email, please hold on...
              </p>
            </>
          )}

          {/* SUCCESS STATE */}
          {isSuccess && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-medium text-lg text-green-600">
                Email verified successfully!
              </p>
              <p className="text-muted-foreground text-sm">
                Your account is now active. You can close this tab or log in.
              </p>
            </>
          )}

          {/* ERROR STATE */}
          {isError && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="font-medium text-lg text-destructive">
                Verification Failed
              </p>
              <p className="text-muted-foreground text-sm">
                {error?.data?.message || "The link is invalid or has expired."}
              </p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          {isSuccess ? (
            <Button asChild className="w-full">
              <Link to="/signin">Go to Login</Link>
            </Button>
          ) : isError ? (
            <Button asChild variant="outline" className="w-full">
              <Link to="/signup">Back to Signup</Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailScreen;
