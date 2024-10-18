const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/auth");

jest.mock("jsonwebtoken");

describe("Auth - Unit tests", () => {
    describe("generateAccessToken", () => {
        it("should generate a token with the correct payload and expiration", () => {
            // ARRANGE
            const mockPayload = {
                id: "1",
                username: "user",
                role: "user",
            };
            const mockToken = "mockToken";
            // mock the behavior of jwt.sign
            jwt.sign.mockReturnValue(mockToken);

            // ACT
            const token = auth.generateAccessToken(mockPayload);

            //  ASSERT
            expect(jwt.sign).toHaveBeenCalledWith(
                mockPayload,
                process.env.TOKEN_SECRET,
                { expiresIn: "1800s" }
            );
            expect(token).toBe(mockToken);
        });
    });

    describe("authenticateToken", () => {
        let req, res, next;
        // set jest beforeEach hook for pre test setup
        beforeEach(() => {
            req = { headers: {} }; //mock request object
            // mock response object
            res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            // mock next middleware function
            next = jest.fn();
        });

        it("should return 401 if no token is provided", () => {
            //ACT
            auth.authenticateToken(req, res, next);

            //ASSERT
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "No auth token" });
            expect(next).not.toHaveBeenCalled();
        });

        it("should return 403 if token verification fails", () => {
            //ARRANGE
            req.headers["authorization"] = "Bearer invalidToken";
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new Error("Token is invalid"), null);
            });

            //ACT
            auth.authenticateToken(req, res, next);

            //ASSERT
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: "Authentication error: Token is invalid",
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next if token verification succeeds", () => {
            req.headers["authorization"] = "Bearer validToken";
            const mockUser = {
                id: "1",
                username: "user",
                role: "user",
            };
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, mockUser);
            });

            auth.authenticateToken(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toEqual(mockUser);
        });
    });

    describe("checkAdminRole", () => {
        let req, res, next;
        // set jest beforeEach hook for pre test setup
        beforeEach(() => {
            req = { user: {} }; //mock request object
            // mock response object
            res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            // mock next middleware function
            next = jest.fn();
        });
        it("should return 403 if user role not admin", () => {
            req.user.role = "user";

            auth.checkAdminRole(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: "Access denied",
            });
            expect(next).not.toHaveBeenCalled();
        });
        it("should call next if user has admin role", () => {
            req.user.role = "admin";

            auth.checkAdminRole(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
