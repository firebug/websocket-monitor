/* See license.txt for terms of usage */

"use strict";

/**
 * WAMP parser logic is automatically generated using meta-wamp project
 * https://github.com/darkl/meta-wamp
 *
 * See also: https://github.com/firebug/websocket-monitor/issues/32
 */

var WampMessageType;
(function (WampMessageType) {
    WampMessageType[WampMessageType["Hello"] = 1] = "Hello";
    WampMessageType[WampMessageType["Welcome"] = 2] = "Welcome";
    WampMessageType[WampMessageType["Abort"] = 3] = "Abort";
    WampMessageType[WampMessageType["Challenge"] = 4] = "Challenge";
    WampMessageType[WampMessageType["Authenticate"] = 5] = "Authenticate";
    WampMessageType[WampMessageType["Goodbye"] = 6] = "Goodbye";
    WampMessageType[WampMessageType["Error"] = 8] = "Error";
    WampMessageType[WampMessageType["Publish"] = 16] = "Publish";
    WampMessageType[WampMessageType["Published"] = 17] = "Published";
    WampMessageType[WampMessageType["Subscribe"] = 32] = "Subscribe";
    WampMessageType[WampMessageType["Subscribed"] = 33] = "Subscribed";
    WampMessageType[WampMessageType["Unsubscribe"] = 34] = "Unsubscribe";
    WampMessageType[WampMessageType["Unsubscribed"] = 35] = "Unsubscribed";
    WampMessageType[WampMessageType["Event"] = 36] = "Event";
    WampMessageType[WampMessageType["Call"] = 48] = "Call";
    WampMessageType[WampMessageType["Cancel"] = 49] = "Cancel";
    WampMessageType[WampMessageType["Result"] = 50] = "Result";
    WampMessageType[WampMessageType["Register"] = 64] = "Register";
    WampMessageType[WampMessageType["Registered"] = 65] = "Registered";
    WampMessageType[WampMessageType["Unregister"] = 66] = "Unregister";
    WampMessageType[WampMessageType["Unregistered"] = 67] = "Unregistered";
    WampMessageType[WampMessageType["Invocation"] = 68] = "Invocation";
    WampMessageType[WampMessageType["Interrupt"] = 69] = "Interrupt";
    WampMessageType[WampMessageType["Yield"] = 70] = "Yield";
})(WampMessageType || (WampMessageType = {}));
function parseWampMessage(message) {
    var messageArray = JSON.parse(message);
    var messageType = messageArray[0], args = messageArray.slice(1);
    switch (messageType) {
        case WampMessageType.Hello:
            return new HelloMessage(args);
        case WampMessageType.Welcome:
            return new WelcomeMessage(args);
        case WampMessageType.Abort:
            return new AbortMessage(args);
        case WampMessageType.Challenge:
            return new ChallengeMessage(args);
        case WampMessageType.Authenticate:
            return new AuthenticateMessage(args);
        case WampMessageType.Goodbye:
            return new GoodbyeMessage(args);
        case WampMessageType.Error:
            return new ErrorMessage(args);
        case WampMessageType.Publish:
            return new PublishMessage(args);
        case WampMessageType.Published:
            return new PublishedMessage(args);
        case WampMessageType.Subscribe:
            return new SubscribeMessage(args);
        case WampMessageType.Subscribed:
            return new SubscribedMessage(args);
        case WampMessageType.Unsubscribe:
            return new UnsubscribeMessage(args);
        case WampMessageType.Unsubscribed:
            return new UnsubscribedMessage(args);
        case WampMessageType.Event:
            return new EventMessage(args);
        case WampMessageType.Call:
            return new CallMessage(args);
        case WampMessageType.Cancel:
            return new CancelMessage(args);
        case WampMessageType.Result:
            return new ResultMessage(args);
        case WampMessageType.Register:
            return new RegisterMessage(args);
        case WampMessageType.Registered:
            return new RegisteredMessage(args);
        case WampMessageType.Unregister:
            return new UnregisterMessage(args);
        case WampMessageType.Unregistered:
            return new UnregisteredMessage(args);
        case WampMessageType.Invocation:
            return new InvocationMessage(args);
        case WampMessageType.Interrupt:
            return new InterruptMessage(args);
        case WampMessageType.Yield:
            return new YieldMessage(args);
        default:
            return null;
    }
}
var HelloMessage = (function () {
    function HelloMessage(messageArguments) {
        this._realm = messageArguments[0], this._details = messageArguments[1];
    }
    Object.defineProperty(HelloMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Hello; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HelloMessage.prototype, "messageName", {
        get: function () { return "HELLO"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HelloMessage.prototype, "realm", {
        get: function () { return this._realm; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HelloMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    return HelloMessage;
})();
var WelcomeMessage = (function () {
    function WelcomeMessage(messageArguments) {
        this._session = messageArguments[0], this._details = messageArguments[1];
    }
    Object.defineProperty(WelcomeMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Welcome; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomeMessage.prototype, "messageName", {
        get: function () { return "WELCOME"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomeMessage.prototype, "session", {
        get: function () { return this._session; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomeMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    return WelcomeMessage;
})();
var AbortMessage = (function () {
    function AbortMessage(messageArguments) {
        this._details = messageArguments[0], this._reason = messageArguments[1];
    }
    Object.defineProperty(AbortMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Abort; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbortMessage.prototype, "messageName", {
        get: function () { return "ABORT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbortMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbortMessage.prototype, "reason", {
        get: function () { return this._reason; },
        enumerable: true,
        configurable: true
    });
    return AbortMessage;
})();
var ChallengeMessage = (function () {
    function ChallengeMessage(messageArguments) {
        this._authMethod = messageArguments[0], this._extra = messageArguments[1];
    }
    Object.defineProperty(ChallengeMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Challenge; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeMessage.prototype, "messageName", {
        get: function () { return "CHALLENGE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeMessage.prototype, "authMethod", {
        get: function () { return this._authMethod; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeMessage.prototype, "extra", {
        get: function () { return this._extra; },
        enumerable: true,
        configurable: true
    });
    return ChallengeMessage;
})();
var AuthenticateMessage = (function () {
    function AuthenticateMessage(messageArguments) {
        this._signature = messageArguments[0], this._extra = messageArguments[1];
    }
    Object.defineProperty(AuthenticateMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Authenticate; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthenticateMessage.prototype, "messageName", {
        get: function () { return "AUTHENTICATE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthenticateMessage.prototype, "signature", {
        get: function () { return this._signature; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthenticateMessage.prototype, "extra", {
        get: function () { return this._extra; },
        enumerable: true,
        configurable: true
    });
    return AuthenticateMessage;
})();
var GoodbyeMessage = (function () {
    function GoodbyeMessage(messageArguments) {
        this._details = messageArguments[0], this._reason = messageArguments[1];
    }
    Object.defineProperty(GoodbyeMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Goodbye; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoodbyeMessage.prototype, "messageName", {
        get: function () { return "GOODBYE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoodbyeMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoodbyeMessage.prototype, "reason", {
        get: function () { return this._reason; },
        enumerable: true,
        configurable: true
    });
    return GoodbyeMessage;
})();
var ErrorMessage = (function () {
    function ErrorMessage(messageArguments) {
        this._type = messageArguments[0], this._request = messageArguments[1], this._details = messageArguments[2], this._error = messageArguments[3], this._arguments = messageArguments[4], this._argumentsKw = messageArguments[5];
    }
    Object.defineProperty(ErrorMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Error; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorMessage.prototype, "messageName", {
        get: function () { return "ERROR"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorMessage.prototype, "type", {
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorMessage.prototype, "error", {
        get: function () { return this._error; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorMessage.prototype, "arguments", {
        get: function () { return this._arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorMessage.prototype, "argumentsKw", {
        get: function () { return this._argumentsKw; },
        enumerable: true,
        configurable: true
    });
    return ErrorMessage;
})();
var PublishMessage = (function () {
    function PublishMessage(messageArguments) {
        this._request = messageArguments[0], this._options = messageArguments[1], this._topic = messageArguments[2], this._arguments = messageArguments[3], this._argumentsKw = messageArguments[4];
    }
    Object.defineProperty(PublishMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Publish; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishMessage.prototype, "messageName", {
        get: function () { return "PUBLISH"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishMessage.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishMessage.prototype, "topic", {
        get: function () { return this._topic; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishMessage.prototype, "arguments", {
        get: function () { return this._arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishMessage.prototype, "argumentsKw", {
        get: function () { return this._argumentsKw; },
        enumerable: true,
        configurable: true
    });
    return PublishMessage;
})();
var PublishedMessage = (function () {
    function PublishedMessage(messageArguments) {
        this._request = messageArguments[0], this._publication = messageArguments[1];
    }
    Object.defineProperty(PublishedMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Published; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishedMessage.prototype, "messageName", {
        get: function () { return "PUBLISHED"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishedMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublishedMessage.prototype, "publication", {
        get: function () { return this._publication; },
        enumerable: true,
        configurable: true
    });
    return PublishedMessage;
})();
var SubscribeMessage = (function () {
    function SubscribeMessage(messageArguments) {
        this._request = messageArguments[0], this._options = messageArguments[1], this._topic = messageArguments[2];
    }
    Object.defineProperty(SubscribeMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Subscribe; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscribeMessage.prototype, "messageName", {
        get: function () { return "SUBSCRIBE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscribeMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscribeMessage.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscribeMessage.prototype, "topic", {
        get: function () { return this._topic; },
        enumerable: true,
        configurable: true
    });
    return SubscribeMessage;
})();
var SubscribedMessage = (function () {
    function SubscribedMessage(messageArguments) {
        this._request = messageArguments[0], this._subscription = messageArguments[1];
    }
    Object.defineProperty(SubscribedMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Subscribed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscribedMessage.prototype, "messageName", {
        get: function () { return "SUBSCRIBED"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscribedMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscribedMessage.prototype, "subscription", {
        get: function () { return this._subscription; },
        enumerable: true,
        configurable: true
    });
    return SubscribedMessage;
})();
var UnsubscribeMessage = (function () {
    function UnsubscribeMessage(messageArguments) {
        this._request = messageArguments[0], this._subscription = messageArguments[1];
    }
    Object.defineProperty(UnsubscribeMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Unsubscribe; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsubscribeMessage.prototype, "messageName", {
        get: function () { return "UNSUBSCRIBE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsubscribeMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsubscribeMessage.prototype, "subscription", {
        get: function () { return this._subscription; },
        enumerable: true,
        configurable: true
    });
    return UnsubscribeMessage;
})();
var UnsubscribedMessage = (function () {
    function UnsubscribedMessage(messageArguments) {
        this._request = messageArguments[0];
    }
    Object.defineProperty(UnsubscribedMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Unsubscribed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsubscribedMessage.prototype, "messageName", {
        get: function () { return "UNSUBSCRIBED"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsubscribedMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    return UnsubscribedMessage;
})();
var EventMessage = (function () {
    function EventMessage(messageArguments) {
        this._subscription = messageArguments[0], this._publication = messageArguments[1], this._details = messageArguments[2], this._arguments = messageArguments[3], this._argumentsKw = messageArguments[4];
    }
    Object.defineProperty(EventMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventMessage.prototype, "messageName", {
        get: function () { return "EVENT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventMessage.prototype, "subscription", {
        get: function () { return this._subscription; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventMessage.prototype, "publication", {
        get: function () { return this._publication; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventMessage.prototype, "arguments", {
        get: function () { return this._arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventMessage.prototype, "argumentsKw", {
        get: function () { return this._argumentsKw; },
        enumerable: true,
        configurable: true
    });
    return EventMessage;
})();
var CallMessage = (function () {
    function CallMessage(messageArguments) {
        this._request = messageArguments[0], this._options = messageArguments[1], this._procedure = messageArguments[2], this._arguments = messageArguments[3], this._argumentsKw = messageArguments[4];
    }
    Object.defineProperty(CallMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Call; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallMessage.prototype, "messageName", {
        get: function () { return "CALL"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallMessage.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallMessage.prototype, "procedure", {
        get: function () { return this._procedure; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallMessage.prototype, "arguments", {
        get: function () { return this._arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallMessage.prototype, "argumentsKw", {
        get: function () { return this._argumentsKw; },
        enumerable: true,
        configurable: true
    });
    return CallMessage;
})();
var CancelMessage = (function () {
    function CancelMessage(messageArguments) {
        this._request = messageArguments[0], this._options = messageArguments[1];
    }
    Object.defineProperty(CancelMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Cancel; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CancelMessage.prototype, "messageName", {
        get: function () { return "CANCEL"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CancelMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CancelMessage.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    return CancelMessage;
})();
var ResultMessage = (function () {
    function ResultMessage(messageArguments) {
        this._request = messageArguments[0], this._details = messageArguments[1], this._arguments = messageArguments[2], this._argumentsKw = messageArguments[3];
    }
    Object.defineProperty(ResultMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Result; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultMessage.prototype, "messageName", {
        get: function () { return "RESULT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultMessage.prototype, "arguments", {
        get: function () { return this._arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultMessage.prototype, "argumentsKw", {
        get: function () { return this._argumentsKw; },
        enumerable: true,
        configurable: true
    });
    return ResultMessage;
})();
var RegisterMessage = (function () {
    function RegisterMessage(messageArguments) {
        this._request = messageArguments[0], this._options = messageArguments[1], this._procedure = messageArguments[2];
    }
    Object.defineProperty(RegisterMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Register; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterMessage.prototype, "messageName", {
        get: function () { return "REGISTER"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterMessage.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterMessage.prototype, "procedure", {
        get: function () { return this._procedure; },
        enumerable: true,
        configurable: true
    });
    return RegisterMessage;
})();
var RegisteredMessage = (function () {
    function RegisteredMessage(messageArguments) {
        this._request = messageArguments[0], this._registration = messageArguments[1];
    }
    Object.defineProperty(RegisteredMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Registered; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisteredMessage.prototype, "messageName", {
        get: function () { return "REGISTERED"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisteredMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisteredMessage.prototype, "registration", {
        get: function () { return this._registration; },
        enumerable: true,
        configurable: true
    });
    return RegisteredMessage;
})();
var UnregisterMessage = (function () {
    function UnregisterMessage(messageArguments) {
        this._request = messageArguments[0], this._registration = messageArguments[1];
    }
    Object.defineProperty(UnregisterMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Unregister; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnregisterMessage.prototype, "messageName", {
        get: function () { return "UNREGISTER"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnregisterMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnregisterMessage.prototype, "registration", {
        get: function () { return this._registration; },
        enumerable: true,
        configurable: true
    });
    return UnregisterMessage;
})();
var UnregisteredMessage = (function () {
    function UnregisteredMessage(messageArguments) {
        this._request = messageArguments[0];
    }
    Object.defineProperty(UnregisteredMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Unregistered; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnregisteredMessage.prototype, "messageName", {
        get: function () { return "UNREGISTERED"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnregisteredMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    return UnregisteredMessage;
})();
var InvocationMessage = (function () {
    function InvocationMessage(messageArguments) {
        this._request = messageArguments[0], this._registration = messageArguments[1], this._details = messageArguments[2], this._arguments = messageArguments[3], this._argumentsKw = messageArguments[4];
    }
    Object.defineProperty(InvocationMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Invocation; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationMessage.prototype, "messageName", {
        get: function () { return "INVOCATION"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationMessage.prototype, "registration", {
        get: function () { return this._registration; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationMessage.prototype, "details", {
        get: function () { return this._details; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationMessage.prototype, "arguments", {
        get: function () { return this._arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationMessage.prototype, "argumentsKw", {
        get: function () { return this._argumentsKw; },
        enumerable: true,
        configurable: true
    });
    return InvocationMessage;
})();
var InterruptMessage = (function () {
    function InterruptMessage(messageArguments) {
        this._request = messageArguments[0], this._options = messageArguments[1];
    }
    Object.defineProperty(InterruptMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Interrupt; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterruptMessage.prototype, "messageName", {
        get: function () { return "INTERRUPT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterruptMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterruptMessage.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    return InterruptMessage;
})();
var YieldMessage = (function () {
    function YieldMessage(messageArguments) {
        this._request = messageArguments[0], this._options = messageArguments[1], this._arguments = messageArguments[2], this._argumentsKw = messageArguments[3];
    }
    Object.defineProperty(YieldMessage.prototype, "messageCode", {
        get: function () { return WampMessageType.Yield; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YieldMessage.prototype, "messageName", {
        get: function () { return "YIELD"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YieldMessage.prototype, "request", {
        get: function () { return this._request; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YieldMessage.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YieldMessage.prototype, "arguments", {
        get: function () { return this._arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YieldMessage.prototype, "argumentsKw", {
        get: function () { return this._argumentsKw; },
        enumerable: true,
        configurable: true
    });
    return YieldMessage;
})();

exports.parse = parseWampMessage;
