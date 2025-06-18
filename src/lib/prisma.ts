
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
  purpose: string;
  description: string;
  propertyId: string;
  createdAt: string;
  fromUser?: { name: string };
  toUser?: { name: string };
}

interface MockServiceCharge {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  nextDueDate: string;
  status: string;
  escrowHeld: number;
  payments: MockServiceChargePayment[];
  unit: {
    unitNumber: string;
    property: { name: string };
  };
}

interface MockServiceChargePayment {
  id: string;
  amount: number;
  paymentDate: string;
  status: string;
  escrowReleased: boolean;
}

interface MockMaintenanceWork {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  amount: number;
  escrowHeld: number;
  progress: number;
  vendor: string;
  createdAt: string;
  completedAt?: string;
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
          amount: 45000,
          status: 'COMPLETED',
          type: 'SERVICE_CHARGE',
          purpose: 'Security Services',
          description: 'Monthly security service payment',
          propertyId: '1',
          createdAt: '2024-01-15T10:30:00Z',
          fromUser: { name: 'John Adebayo' },
          toUser: { name: 'SecureGuard Ltd' }
        },
        {
          id: '2',
          amount: 25000,
          status: 'HELD',
          type: 'MAINTENANCE',
          purpose: 'Plumbing Repair',
          description: 'Kitchen sink repair work',
          propertyId: '1',
          createdAt: '2024-01-14T14:20:00Z',
          fromUser: { name: 'Sarah Okafor' },
          toUser: { name: 'FixIt Plumbing' }
        },
        {
          id: '3',
          amount: 35000,
          status: 'COMPLETED',
          type: 'SERVICE_CHARGE',
          purpose: 'Cleaning Services',
          description: 'Monthly cleaning service',
          propertyId: '1',
          createdAt: '2024-01-12T09:15:00Z',
          fromUser: { name: 'Mike Johnson' },
          toUser: { name: 'CleanPro Services' }
        },
        {
          id: '4',
          amount: 15000,
          status: 'PENDING',
          type: 'MAINTENANCE',
          purpose: 'Electrical Work',
          description: 'Light fixture installation',
          propertyId: '1',
          createdAt: '2024-01-10T16:45:00Z',
          fromUser: { name: 'Grace Nwosu' },
          toUser: { name: 'ElectroFix Ltd' }
        },
        {
          id: '5',
          amount: 55000,
          status: 'COMPLETED',
          type: 'SERVICE_CHARGE',
          purpose: 'Generator Maintenance',
          description: 'Quarterly generator servicing',
          propertyId: '1',
          createdAt: '2024-01-08T11:30:00Z',
          fromUser: { name: 'John Adebayo' },
          toUser: { name: 'PowerTech Services' }
        }
      ];
    }
  };

  serviceCharge = {
    findMany: async (): Promise<MockServiceCharge[]> => {
      return [
        {
          id: '1',
          description: 'Security Services',
          amount: 45000,
          frequency: 'MONTHLY',
          nextDueDate: '2024-02-15',
          status: 'ACTIVE',
          escrowHeld: 45000,
          unit: {
            unitNumber: '3B',
            property: { name: 'Marina Heights Apartment' }
          },
          payments: [
            {
              id: 'p1',
              amount: 45000,
              paymentDate: '2024-01-15',
              status: 'COMPLETED',
              escrowReleased: true
            },
            {
              id: 'p2',
              amount: 45000,
              paymentDate: '2023-12-15',
              status: 'COMPLETED',
              escrowReleased: true
            }
          ]
        },
        {
          id: '2',
          description: 'Cleaning Services',
          amount: 35000,
          frequency: 'MONTHLY',
          nextDueDate: '2024-02-12',
          status: 'ACTIVE',
          escrowHeld: 35000,
          unit: {
            unitNumber: '12A',
            property: { name: 'Lekki Phase 2 Complex' }
          },
          payments: [
            {
              id: 'p3',
              amount: 35000,
              paymentDate: '2024-01-12',
              status: 'COMPLETED',
              escrowReleased: true
            }
          ]
        },
        {
          id: '3',
          description: 'Generator Maintenance',
          amount: 55000,
          frequency: 'QUARTERLY',
          nextDueDate: '2024-04-08',
          status: 'ACTIVE',
          escrowHeld: 0,
          unit: {
            unitNumber: 'Unit A',
            property: { name: 'Ikeja Duplex' }
          },
          payments: [
            {
              id: 'p4',
              amount: 55000,
              paymentDate: '2024-01-08',
              status: 'COMPLETED',
              escrowReleased: true
            }
          ]
        },
        {
          id: '4',
          description: 'Waste Management',
          amount: 15000,
          frequency: 'MONTHLY',
          nextDueDate: '2024-02-05',
          status: 'ACTIVE',
          escrowHeld: 15000,
          unit: {
            unitNumber: '205',
            property: { name: 'Victoria Island Office' }
          },
          payments: [
            {
              id: 'p5',
              amount: 15000,
              paymentDate: '2024-01-05',
              status: 'COMPLETED',
              escrowReleased: false
            }
          ]
        }
      ];
    }
  };

  maintenanceWork = {
    findMany: async (): Promise<MockMaintenanceWork[]> => {
      return [
        {
          id: '1',
          title: 'Kitchen Sink Repair',
          description: 'Fix leaking kitchen sink and replace faucet',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          amount: 25000,
          escrowHeld: 25000,
          progress: 75,
          vendor: 'FixIt Plumbing',
          createdAt: '2024-01-14T14:20:00Z'
        },
        {
          id: '2',
          title: 'Light Fixture Installation',
          description: 'Install new LED light fixtures in living room',
          status: 'PENDING',
          priority: 'MEDIUM',
          amount: 15000,
          escrowHeld: 15000,
          progress: 0,
          vendor: 'ElectroFix Ltd',
          createdAt: '2024-01-10T16:45:00Z'
        },
        {
          id: '3',
          title: 'Air Conditioning Service',
          description: 'Complete AC unit maintenance and cleaning',
          status: 'COMPLETED',
          priority: 'LOW',
          amount: 20000,
          escrowHeld: 0,
          progress: 100,
          vendor: 'CoolAir Services',
          createdAt: '2024-01-05T09:30:00Z',
          completedAt: '2024-01-07T15:00:00Z'
        },
        {
          id: '4',
          title: 'Roof Waterproofing',
          description: 'Emergency roof leak repair and waterproofing',
          status: 'COMPLETED',
          priority: 'EMERGENCY',
          amount: 75000,
          escrowHeld: 0,
          progress: 100,
          vendor: 'RoofMasters Ltd',
          createdAt: '2024-01-02T08:00:00Z',
          completedAt: '2024-01-04T17:30:00Z'
        }
      ];
    }
  };
}

export const prisma = new MockPrismaClient();
