import { NextFunction, Request, Response } from "express";

const protectedPage = (req: Request, res: Response, next: NextFunction) => {
  const user = { userId: req.user.id, role: req.user.role, isSignedIn: true };

  res.status(200).json({
    status: "Success",
    data: { user },
  });
};

export default protectedPage;
