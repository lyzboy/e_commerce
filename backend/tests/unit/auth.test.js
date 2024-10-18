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
});
