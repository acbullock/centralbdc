let dealerships = [
    { value: '1', label: 'Audi Brooklyn' },
    { value: '2', label: 'Plaza Acura' },
    { value: '3', label: 'PARAGON ACURA' },
    { value: '4', label: 'Garland/Dallas Cadillac (Call at 9am)' },
    { value: '5', label: 'Performance Chevrolet' },
    { value: '6', label: 'Peterson Toyota Chrysler Jeep Dodge Ram' },
    { value: '7', label: 'Steven\'s 112 Ford' },
    { value: '8', label: 'Steven\'s Jersey City Ford' },
    { value: '9', label: 'Benton Nissan Oxford (Start 9AM)' },
    { value: '10', label: 'Champion Ford' },
    { value: '11', label: 'Crossroads Ford' },
    { value: '12', label: 'Ford of Branford' },
    { value: '13', label: 'Stearns Ford' },
    { value: '14', label: 'Plaza Honda' },
    { value: '15', label: 'Classic Honda' },
    { value: '16', label: 'Paragon Honda' },
    { value: '17', label: 'White Plains Honda' },
    { value: '18', label: 'Bryna Honda' },
    { value: '19', label: 'Gary Yeoman Honda' },
    { value: '20', label: 'Keffer Hyundai' },
    { value: '21', label: 'Plaza Hyundai' },
    { value: '22', label: 'Davis Hyundai' },
    { value: '23', label: 'City World Hyundai' },
    { value: '24', label: 'Lee Hyundai' },
    { value: '25', label: 'Southtowne Hyundai of Riverdale' },
    { value: '26', label: 'Southtowne Hyundai of Newman' },
    { value: '27', label: 'Benson Hyundai' },
    { value: '28', label: 'Union County Kia' },
    { value: '29', label: 'Plaza Kia' },
    { value: '30', label: 'Benson Kia' },
    { value: '31', label: 'Hutchinson Kia of Albany' },
    { value: '32', label: 'Courage Kia' },
    { value: '33', label: 'Mazda of Palm Beach' },
    { value: '34', label: 'Keffer Mazda' },
    { value: '35', label: 'Benton Nissan of Bessemer (Start 9AM)' },
    { value: '36', label: 'Lee Nissan' },
    { value: '37', label: 'West Palm Beach Nissan' },
    {value: '38', label: "Benson Nissan"},
    {value: '39', label: "Hutchinson Toyota of Albany"},
    {value: '40', label: "Burlington VW"},
    {value: '41', label: "Fayetteville Automall"},
    {value: '42', label: "Sale Automall"},
    {value: '43', label: "Carolina CDJR"},
    {value: '44', label: "Mount Airy CJDR"},
    {value: '45', label: "Atlantic CJDR"},
    {value: '46', label: "Bay Ridge CDJR"}
]
let departments = [
    { value: "47", label: "Sales" },
    { value: "48", label: "Data-Mining" },
    { value: "49", label: "Service to Sales" }
]
let scenarios = [
    {
        value: "50", isDisabled: true, label: "Data-Mining"
    },
    {
        value: "51", label: "High Interest"
    },
    {
        value: "52", label: "Easy Lease Upgrade"
    },
    {
        value: "53", label: "Buy Back Offer"
    },
    {
        value: "54", isDisabled: true, label: "Sales"
    },
    {
        value: "55", label: "NEW - Coming in to take advantage of employee pricing sales event"
    },
    {
        value: "56", label: "USED - Coming in to view pre-owned inventory for VIP appointment"
    },
    {
        value: "57", label: "Coming in for bank interview with finance manager"
    },
    {
        value: "58", isDisabled: true, label: "Service to Sales"
    },
    {
        value: "59", label: "Meeting with VIP manager to hear buy back offer on current vehicle"
    },
    
]
let compareLabels = (a, b) => {
    if (a.label > b.label) {
        return 1;
    }
    if (a.label < b.label) {
        return -1;
    }
    // a must be equal to b
    return 0;
}
let compareValues = (a, b) => {
    if (a.value > b.value) {
        return 1;
    }
    if (a.value < b.value) {
        return -1;
    }
    // a must be equal to b
    return 0;
}
dealerships.sort(compareLabels)
departments.sort(compareLabels)
scenarios.sort(compareValues)
export default {
    dealerships,
    departments,
    scenarios
}