import 'tui-calendar/dist/tui-calendar.css'
import { Calendar } from '@toast-ui/vue-calendar'
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import MypageNametag from "@/components/mypage/MypageNametag.vue";
import MypageGap from "@/components/mypage/MypageGap.vue";
import Inquiry from "@/components/mypage/Inquiry.vue";
import Axios from "axios";
import moment from 'moment';

var session = JSON.parse(sessionStorage.getItem("company"));

/* setting week*/
moment.locale('ko'); //set Korean Time

/* calendar tag DONT FIXING IT*/
let calendarList = [{
        id: '0',
        name: 'Pics예약',
        color: '#ffffff',
        bgColor: '#00a9ff',
        dragBgColor: '#00a9ff',
        borderColor: '#00a9ff'
    },
    {
        id: '1',
        name: '예약불가능',
        color: '#ffffff',
        bgColor: '#757575',
        dragBgColor: '#757575',
        borderColor: '#757575'
    }
]
export default {
    name: "CompanyMypage",
    components: {
        MypageNametag,
        MypageGap,
        Inquiry,
        'calendar': Calendar,
        moment
    },
    data() {
        return {
            comId: session.comId,
            studioList: [],
            studioFlag: true,
            selectedId: "",

            /* calendar basic setting */
            readOnly: true,

            /*calendar header */
            startWeek: moment().startOf('week').format('L'),
            endWeek: moment().endOf('week').format('L'),

            /*Calendar index*/
            calendarList,
            scheduleList: [],

            /* for modal */
            styles: "",
            categoryColor: "",
            indexFlag: false,

            /* Detail */
            userId: 0,
            userName: "",
            reservationDate: "",
            reservationCategory: "",
            totalPeople: 0,
            totalPrice: 0,

            /*for reservation delete*/
            scheduleId: 0,
            calendarId: "",
        };
    },
    mounted() {
        /* 소유 스튜디오 불러오기 */
        Axios.get("http://localhost:7777/studio/" + this.comId)
            .then(res => {
                this.studioList = res.data;
                this.studioFlag = false;
            }).catch(err => {
                console.log(err);
            });

    },
    methods: {
        getStudioReservation: function() {
            //초기화 안하면 쌓임
            this.scheduleList = [];

            Axios.get("http://localhost:7777/company/schedule/" + this.selectedId)
                .then(res => {
                    // console.log(res.data);
                    var data = res.data;

                    /* Exception Date Setting */
                    for (var i = 0; i < data.exceptionDate.length; i++) {
                        this.scheduleList.push({
                            id: data.exceptionDate[i].exceptionId,
                            calendarId: '1',
                            title: data.exceptionDate[i].exceptionTitle,
                            category: 'time',
                            dueDateClass: '',
                            start: Date.parse(data.exceptionDate[i].startDate),
                            end: Date.parse(data.exceptionDate[i].endDate)
                        });
                    }

                    /* Reservation Setting */
                    for (var j = 0; j < data.reservation.length; j++) {
                        this.scheduleList.push({
                            id: data.reservation[j].resId,
                            calendarId: '0',
                            title: data.reservation[j].customer.nickname,
                            category: 'time',
                            dueDateClass: '',
                            start: Date.parse(data.reservation[j].startDate),
                            end: Date.parse(data.reservation[j].endDate),
                            body: [data.reservation[j].custId, data.reservation[j].totalPrice, data.reservation[j].totalPeople],
                        });
                    }
                    this.readOnly = false;
                })
                .catch(err => {
                    console.log(err);
                })
        },

        /* 지난주로 */
        prevWeek: function() {
            this.$refs.studioCalendar.invoke('prev');
            this.changeFormat(this.$refs.studioCalendar.invoke('getDateRangeStart'), this.$refs.studioCalendar.invoke('getDateRangeEnd'));
            //alert(this.$refs.studioCalendar.invoke('getDate').toDate()); check dateexception_title
        },

        /* 이번주로 */
        moveToday: function() {
            this.$refs.studioCalendar.invoke('today');
            this.changeFormat(this.$refs.studioCalendar.invoke('getDateRangeStart'), this.$refs.studioCalendar.invoke('getDateRangeEnd'));
        },

        /* 다음주로 */
        nextWeek: function() {
            this.$refs.studioCalendar.invoke('next');
            this.changeFormat(this.$refs.studioCalendar.invoke('getDateRangeStart'), this.$refs.studioCalendar.invoke('getDateRangeEnd'));
        },

        /* 날짜 변환용 */
        changeFormat: function(start, end) {
            this.startWeek = moment(start.toUTCString()).format('L');
            this.endWeek = moment(end.toUTCString()).format('L');

        },

        /* Custom Creation Modal */
        onBeforeCreateSchedule: function(e) {
            this.$modal.show("creationModal");
            console.log(e);

        },

        /*Custom Detail Modal */
        onClickSchedule: function(e) {
            this.$modal.show("detailModal");
            this.reservationDate = moment((e.schedule.start).toUTCString()).format('LLLL') + "<br/>" + moment(((e.schedule.end)).toUTCString()).format('LLLL');
            this.styles = "border-left: 10px solid" + e.schedule.bgColor;
            this.categoryColor = "background-color:" + e.schedule.bgColor;
            this.scheduleId = e.schedule.id;
            this.calendarId = e.schedule.calendarId;

            if (e.schedule.calendarId == "0") {
                this.reservationCategory = "Pics예약";
                this.userName = e.schedule.title + " 님";
                this.userId = e.schedule.body[0];
                this.totalPeople = e.schedule.body[2];
                this.totalPrice = e.schedule.body[1];
                this.indexFlag = true;
            } else {
                this.reservationCategory = "예약불가능";
                this.userName = e.schedule.title;
                this.indexFlag = false;
            }
        },

        /* Custom Update Modal */
        onBeforeUpdateSchedule: function(e) {
            this.$refs.studioCalendar.invoke('updateSchedule', e.schedule.id, e.schedule.calendarId, e.changes);

            /* update reservation */
            if (e.schedule.calendarId == "0") {
                //axios 예약
                Axios.put("http://localhost:7777/studio/reservation", {
                    resId: Number(e.schedule.id),
                    startDate: moment((e.schedule.start).toUTCString()).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: moment((e.schedule.end).toUTCString()).format('YYYY-MM-DD HH:mm:ss')
                }).then(() => {
                    console.log("수정완료");
                }).catch(err => {
                    console.log(err);
                })
            }

            /* update exceptionDate */
            else {
                Axios.put("http://localhost:7777/studio/exceptionDate", {
                    exceptionId: Number(e.schedule.id),
                    startDate: moment((e.schedule.start).toUTCString()).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: moment((e.schedule.end).toUTCString()).format('YYYY-MM-DD HH:mm:ss')
                }).then(() => {
                    console.log("수정완료");
                }).catch(err => {
                    console.log(err);
                })
            }
        },

        /* Delete Reservation */
        onBeforeDeleteSchedule: function() {
            this.$refs.studioCalendar.invoke('deleteSchedule', this.scheduleId, this.calendarId);
            /* delete reservation */
            if (this.calendarId == "0") {
                Axios.delete("http://localhost:7777/studio/reservation/" + this.scheduleId)
                    .then(() => {
                        console.log("삭제 완.");
                    }).catch(err => {
                        console.log(err);
                    })
            }

            /* delete Exception */
            else {
                Axios.delete("http://localhost:7777/studio/exceptionDate/" + this.scheduleId)
                    .then(() => {
                        console.log("삭제 완.");
                    }).catch(err => {
                        console.log(err);
                    })
            }
            this.$modal.hide("detailModal");
        },
    }

};