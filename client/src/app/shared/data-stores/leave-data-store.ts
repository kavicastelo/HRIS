import {LeaveModel} from "../data-models/Leave.model";

export var leaveDataStore: LeaveModel[] = [
    {
        id:"1",
        leaveType:"ANNUAL",
        leaveStartDate:"Thu May 02 2024 17:25:15 GMT+0530 (India Standard Time)",
        leaveEndDate:"Thu June 02 2024 17:25:15 GMT+0530 (India Standard Time)",
        approved:"approved",
        leaveBalance:"4",
    },
    {
        id:"2",
        leaveType:"SICK",
        leaveStartDate:"Thu May 02 2024 17:25:15 GMT+0530 (India Standard Time)",
        leaveEndDate:"Thu May 04 2024 17:25:15 GMT+0530 (India Standard Time)",
        approved:"pending",
        leaveBalance:"4",
    },
    {
        id:"3",
        leaveType:"MATERNITY",
        leaveStartDate:"Thu May 02 2024 17:25:15 GMT+0530 (India Standard Time)",
        leaveEndDate:"Thu May 05 2024 17:25:15 GMT+0530 (India Standard Time)",
        approved:"pending",
        leaveBalance:"4",
    },
    {
        id:"4",
        leaveType:"PATERNITY",
        leaveStartDate:"Thu May 02 2024 17:25:15 GMT+0530 (India Standard Time)",
        leaveEndDate:"Thu May 03 2024 17:25:15 GMT+0530 (India Standard Time)",
        approved:"approved",
        leaveBalance:"4",
    },
    {
        id:"5",
        leaveType:"UNPAID",
        leaveStartDate:"Thu May 02 2024 17:25:15 GMT+0530 (India Standard Time)",
        leaveEndDate:"Thu May 03 2024 17:25:15 GMT+0530 (India Standard Time)",
        approved:"rejected",
        leaveBalance:"4",
    },
    {
        id:"6",
        leaveType:"ANNUAL",
        leaveStartDate:"Thu May 02 2024 17:25:15 GMT+0530 (India Standard Time)",
        leaveEndDate:"Thu June 12 2024 17:25:15 GMT+0530 (India Standard Time)",
        approved:"pending",
        leaveBalance:"4",
    }
]