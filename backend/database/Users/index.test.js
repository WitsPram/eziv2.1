// index.test.js
const { readerUserData, insertUserData, updateUserPfp , readAllUsers , blockUser } = require('./index.js');
const { ConnectionPool } = require('mssql');
const config = require('../config.js');
const { describe } = require('node:test');

jest.mock('mssql');
jest.mock('../config.js', () => ({
    connectionString: 'mock-connection-string',
}));

describe('Database operations', () => {
    let mockPool;
    let mockRequest;

    beforeEach(() => {
        mockRequest = {
            query: jest.fn(),
        };

        mockPool = {
            connect: jest.fn(),
            close: jest.fn(),
            request: jest.fn(() => mockRequest),
        };

        ConnectionPool.mockImplementation(() => mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('readerUserData', () => {
        it('should return user data if user exists', async () => {
            const mockUserID = 'test@example.com';
            const mockResult = {
                recordset: [{ profile_pic_url: 'http://example.com/pic.jpg', user_type: 'Applicant', name: 'Test User' }],
            };
            mockRequest.query.mockResolvedValueOnce(mockResult);
    
            const response = await readerUserData(mockUserID);
    
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining(`SELECT profile_pic_url, user_type, name FROM [User] WHERE email = '${mockUserID}'`));
            expect(mockPool.close).toHaveBeenCalled();
            expect(response).toEqual({ profile_pic_url: 'http://example.com/pic.jpg', user_type: 'Applicant', name: 'Test User', message: 'Success' });
        });
    
        it('should insert user data and return success message if user does not exist', async () => {
            const mockUserID = 'newuser@example.com';
            const mockSelectResult = {
                recordset: [],
            };
            const mockInsertResult = {
                rowsAffected: [1],
            };
            mockRequest.query
                .mockResolvedValueOnce(mockSelectResult) // For the SELECT query
                .mockResolvedValueOnce(mockInsertResult); // For the INSERT query
    
            const response = await readerUserData(mockUserID);
    
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining(`SELECT profile_pic_url, user_type, name FROM [User] WHERE email = '${mockUserID}'`));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining(`INSERT INTO [User] (email, profile_pic_url, user_type, created_at, disabled) VALUES ('${mockUserID}', 'https://cdn-icons-png.freepik.com/256/11419/11419168.png?semt=ais_hybrid', 'Applicant', GETDATE(), 0);`));
            expect(mockPool.close).toHaveBeenCalled();
            expect(response).toEqual({ message: 'Success', profile_pic_url: 'https://cdn-icons-png.freepik.com/256/11419/11419168.png?semt=ais_hybrid', user_type: 'Applicant' });
        });
    
        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            mockRequest.query.mockRejectedValue(mockError);
    
            await expect(readerUserData('test@example.com')).rejects.toThrow('Database error');
            expect(mockPool.close).toHaveBeenCalled();
        });
    
        it('should close the pool even if an error occurs', async () => {
            const mockError = new Error('Another error');
            mockRequest.query.mockRejectedValue(mockError);
    
            await expect(readerUserData('test@example.com')).rejects.toThrow('Another error');
            expect(mockPool.close).toHaveBeenCalledTimes(2); // Once in the try block and once in the finally block
        });
    });
    
    describe('readAllUsers', () => {
        it('should retrieve all users', async () => {
            const mockUsers = [
                { id: 1, email: 'user1@example.com', disabled: 0 },
                { id: 2, email: 'user2@example.com', disabled: 0 },
            ];
            const mockResult = {
                recordset: mockUsers,
            };
            mockRequest.query.mockResolvedValue(mockResult);

            const users = await readAllUsers();

            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM [User] where disabled = 0'));
            expect(mockPool.close).toHaveBeenCalled();
            expect(users).toEqual(mockUsers);
        });

        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            mockRequest.query.mockRejectedValue(mockError);

            await expect(readAllUsers()).rejects.toThrow('Database error');
            expect(mockPool.close).toHaveBeenCalled();
        });

        it('should close the pool even if an error occurs', async () => {
            const mockError = new Error('Another error');
            mockRequest.query.mockRejectedValue(mockError);

            await expect(readAllUsers()).rejects.toThrow('Another error');
            expect(mockPool.close).toHaveBeenCalledTimes(2); // Once in the try block and once in the finally block
        });
    });

    describe('insertUserData', () => {
        it('should insert user data and return success message', async () => {
            const mockEmail = 'test@example.com';
            const mockProfilePicUrl = 'http://example.com/pic.jpg';
            const mockResult = {
                rowsAffected: [1],
            };
            mockRequest.query.mockResolvedValue(mockResult);
    
            const response = await insertUserData(mockEmail, mockProfilePicUrl);
    
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining(`INSERT INTO [User] (email, profile_pic_url, user_type, created_at)`));
            expect(mockPool.close).toHaveBeenCalled();
            expect(response).toEqual({ message: 'Success' });
        });

        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            mockRequest.query.mockRejectedValue(mockError);

            await expect(insertUserData('test@example.com', 'http://example.com/pic.jpg')).rejects.toThrow('Database error');
            expect(mockPool.close).toHaveBeenCalled();
        });
    });

    describe('updateUserPfp', () => {
        it('should update user data and return success message', async () => {
            const mockEmail = 'test@example.com';
            const mockProfilePicUrl = 'http://example.com/pic.jpg';
            const mockResult = {
                rowsAffected: [1],
            };
            mockRequest.query.mockResolvedValue(mockResult);

            const response = await updateUserPfp(mockEmail, mockProfilePicUrl);

            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining(`UPDATE [User] SET profile_pic_url = '${mockProfilePicUrl}' WHERE email = '${mockEmail}';`));
            expect(mockPool.close).toHaveBeenCalled();
            expect(response).toEqual({ message: 'Success' });
        });

        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            mockRequest.query.mockRejectedValue(mockError);

            await expect(updateUserPfp('test@example.com', 'http://example.com/pic.jpg')).rejects.toThrow('Database error');
            expect(mockPool.close).toHaveBeenCalled();
        });
    });

    describe('blockUser', () => {
        it('should block a user and return success message', async () => {
            const mockEmail = 'test@example.com';
            const mockResult = {
                rowsAffected: [1],
            };
            mockRequest.query.mockResolvedValue(mockResult);
    
            const response = await blockUser(mockEmail);
    
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining(`UPDATE [User] SET disabled = 1 WHERE email = '${mockEmail}'`));
            expect(mockPool.close).toHaveBeenCalled();
            expect(response).toEqual({ message: 'Success' });
        });
    
        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            mockRequest.query.mockRejectedValue(mockError);
    
            await expect(blockUser('test@example.com')).rejects.toThrow('Database error');
            expect(mockPool.close).toHaveBeenCalled();
        });
    
        it('should close the pool even if an error occurs', async () => {
            const mockError = new Error('Another error');
            mockRequest.query.mockRejectedValue(mockError);
    
            await expect(blockUser('test@example.com')).rejects.toThrow('Another error');
            expect(mockPool.close).toHaveBeenCalledTimes(2); // Once in the try block and once in the finally block
        });
    });
});
