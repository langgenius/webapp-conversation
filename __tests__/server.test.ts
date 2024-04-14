import { authSpeedyAgencyMember } from '@/app/api/utils/speedyagency';

describe("Test Server", () => {
    it('authSpeedyAgencyMember', async function () {
        const channel = await authSpeedyAgencyMember('11111111');

        console.log(channel);

        expect(channel).toEqual("aia")
    });
})
