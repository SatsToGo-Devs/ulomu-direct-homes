
// Mock Prisma client for development
// In a real application, this would be the actual Prisma client

interface MockProperty {
  id: string;
  name: string;
  address: string;
  rentAmount: number;
  status: string;
}

interface MockEscrowTransaction {
  id: string;
  amount: number;
  status: string;
  type: string;
  propertyId: string;
  createdAt: Date;
}

class MockPrismaClient {
  property = {
    findMany: async (): Promise<MockProperty[]> => {
      return [
        {
          id: '1',
          name: 'Marina Heights Apartment',
          address: '123 Marina Street, Lagos',
          rentAmount: 500000,
          status: 'occupied'
        }
      ];
    },
    
    findUnique: async (params: { where: { id: string } }): Promise<MockProperty | null> => {
      return {
        id: params.where.id,
        name: 'Marina Heights Apartment',
        address: '123 Marina Street, Lagos',
        rentAmount: 500000,
        status: 'occupied'
      };
    }
  };

  escrowTransaction = {
    findMany: async (): Promise<MockEscrowTransaction[]> => {
      return [
        {
          id: '1',
          amount: 25000,
          status: 'pending',
          type: 'maintenance',
          propertyId: '1',
          createdAt: new Date()
        }
      ];
    }
  };
}

export const prisma = new MockPrismaClient();
